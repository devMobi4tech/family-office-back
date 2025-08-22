import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
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

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
    private emailService: EmailService,
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
      const isMatch = await bcrypt.compare(request.senha, user.senhaHash);
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
    if (user) {
      const userResetTokens = await this.getResetTokensFromUser(user);
      if (this.verifyIfUserHasRecentTokens(userResetTokens, 5)) {
        // Gerar novo reset token apenas caso o usuário não tenha feito uma solicitação nos ultimos 5 minutos
        const agoraUTC = new Date();
        const token = this.generatePasswordResetToken();
        const resetCode = this.resetTokensRepository.create({
          user,
          tokenHash: await bcrypt.hash(token, 10),
          expiraEm: new Date(agoraUTC.getTime() + 15 * 60 * 1000), // 15 minutos
        });

        await this.emailService.sendUserRecoverPasswordToken(
          user.nomeCompleto,
          user.email,
          token,
        );

        await this.resetTokensRepository.save(resetCode);
      }
    }
    return new ForgotPasswordResponseDto(
      'Se o e-mail estiver cadastrado, um token foi enviado para redefinição de senha. ' +
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
        const isMatch = await bcrypt.compare(request.token, reset.tokenHash);
        if (isMatch) {
          return new ValidateResetTokenResponseDto(
            true,
            'Token válido. Pode prosseguir com a redefinição de senha.',
          );
        }
      }
    }
    throw new BadRequestException('Token inválido ou expirado.');
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
      request.token,
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
    const recentToken = recentTokens.find(
      (token) => now.getTime() - token.criadoEm.getTime() < minutes * 60 * 1000,
    );

    return recentToken == undefined;
  }
}
