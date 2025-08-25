import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TipoAutenticacao, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  ForogtPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ValidateResetTokenRequestDto,
} from './dto/request-auth.dto';
import {
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  TokenResponseDto,
  ValidateResetTokenResponseDto,
} from './dto/response-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset_token.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/mail/email.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async register(request: RegisterRequestDto): Promise<TokenResponseDto> {
    const user = await this.userService.createUser(request);

    const accessToken = await this.generateToken(user);

    return new TokenResponseDto(accessToken);
  }

  private async generateToken(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.nomeCompleto,
      email: user.email,
    });
    return accessToken;
  }

  async login(request: LoginRequestDto): Promise<TokenResponseDto> {
    const user = await this.userService.findByEmail(request.email);
    if (user) {
      const isMatch = await bcrypt.compare(request.senha, user.senha);
      if (isMatch) {
        const accessToken = await this.generateToken(user);
        return new TokenResponseDto(accessToken);
      }
    }
    throw new UnauthorizedException('E-mail ou senha incorretos.');
  }

  async forgotPassword(
    request: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    const user = await this.userService.findByEmail(request.email);
    if (user && user.tipoAutenticacao === TipoAutenticacao.LOCAL) {
      const userResetTokens = await this.getResetTokensFromUser(user);

      // Só gera um novo código se NÃO houver solicitado nos últimos 5 minutos
      if (!this.verifyIfUserHasRecentTokens(userResetTokens, 5)) {
        if (userResetTokens) {
          this.resetTokensRepository.remove(userResetTokens);
        }
        const code = this.generatePasswordResetToken();
        const resetToken = this.resetTokensRepository.create({
          user: user,
          codigo: code,
          expiraEm: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        });

        await this.emailService.sendUserRecoverPasswordToken(
          user.nomeCompleto,
          user.email,
          code,
        );

        await this.resetTokensRepository.save(resetToken);
      }
    }
    return new ForgotPasswordResponseDto(
      'Se o e-mail estiver cadastrado, um código foi enviado para redefinição de senha. ' +
        'Se você não recebeu, aguarde alguns minutos antes de tentar novamente.',
    );
  }

  async validateResetToken(
    request: ValidateResetTokenRequestDto,
  ): Promise<ValidateResetTokenResponseDto> {
    const user = await this.userService.findByEmail(request.email);
    if (user) {
      const resetTokens = await this.getResetTokensFromUser(user);
      for (const reset of resetTokens) {
        if (reset.expiraEm < new Date()) {
          await this.resetTokensRepository.remove(reset);
          continue;
        }
        const isMatch = await bcrypt.compare(request.codigo, reset.codigo);
        if (isMatch) {
          return new ValidateResetTokenResponseDto(
            true,
            'Código válido. Pode prosseguir com a redefinição de senha.',
          );
        }
      }
    }
    throw new BadRequestException('Código inválido ou expirado.');
  }

  async resetPassword(
    request: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    if (request.senha !== request.confirmacaoSenha) {
      throw new BadRequestException('As senhas não conferem.');
    }
    const user = await this.userService.findByEmail(request.email);
    if (!user) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const validateResetTokenRequestDto = new ValidateResetTokenRequestDto(
      request.email,
      request.codigo,
    );
    const validateResetToken = await this.validateResetToken(
      validateResetTokenRequestDto,
    );
    if (!validateResetToken.isValid) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    await this.userService.updatePassword(user, request.senha);
    await this.resetTokensRepository.delete({ user: { id: user.id } });

    return new ResetPasswordResponseDto(
      true,
      'Senha alterada com sucesso. Você já pode fazer login com a nova senha.',
    );
  }

  getGoogleCallbackUrl(): string {
    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ');

    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  }

  async loginUserWithGoogle(code: string): Promise<TokenResponseDto> {
    if (!code) {
      throw new BadRequestException('Código de autorização não fornecido');
    }

    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI')!;
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')!;
    const clientSecret = this.configService.get<string>('GOOGLE_SECRET')!;

    let tokenResponse: any;
    try {
      tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
    } catch (error: any) {
      throw new BadRequestException(
        'Código de autorização inválido ou expirado',
      );
    }

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const userData = userResponse.data;

    return this.googleLogin(userData);
  }

  async googleLogin(userData: any): Promise<TokenResponseDto> {
    const user = await this.userService.loginWithGoogle(userData);
    const accessToken = await this.generateToken(user);
    return new TokenResponseDto(accessToken);
  }

  private generatePasswordResetToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async getResetTokensFromUser(user: User): Promise<ResetToken[]> {
    const resetTokens = await this.resetTokensRepository.find({
      where: { user: { id: user.id } },
    });
    return resetTokens;
  }

  private verifyIfUserHasRecentTokens(
    recentTokens: ResetToken[],
    minutes: number,
  ): boolean {
    const now = new Date();
    const limite = now.getTime() - minutes * 60 * 1000;

    const recentToken = recentTokens.find(
      (token) => token.criadoEm.getTime() > limite,
    );

    return recentToken !== undefined;
  }
}
