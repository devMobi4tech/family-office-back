import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  ForogtPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ValidateResetTokenRequestDto,
} from './dto/request-auth.dto';
import {
  ForgotPasswordResponseDto,
  TokenResponseDto,
  ValidateResetTokenResponseDto,
} from './dto/response-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset_token.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
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
    throw new BadRequestException('E-mail ou senha incorretos.');
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

        // TODO: Enviar token para e-mail do usuário
        console.log(token);

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

  private generatePasswordResetToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async getResetTokensFromUser(user: User): Promise<ResetToken[]> {
    const resetTokens = await this.resetTokensRepository.find({
      where: { user: { id: user.id } },
    });
    return resetTokens;
  }

  verifyIfUserHasRecentTokens(
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
