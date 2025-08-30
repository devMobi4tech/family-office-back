import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TipoAutenticacao } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/mail/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset_token.entity';
import { ResetPasswordResponseDto } from './dto/responses/reset-password-response.dto';
import { ValidateResetCodeResponseDto } from './dto/responses/validate-reset-code-response.dto';
import { RegisterRequestDto } from './dto/requests/register-request.dto';
import { ForogtPasswordRequestDto } from './dto/requests/forgot-password-request.dto';
import { ValidateResetCodeRequestDto } from './dto/requests/validate-reset-code-request.dto';
import { ResetPasswordRequestDto } from './dto/requests/reset-password-request.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    @InjectRepository(ResetToken)
    private resetTokensRepository: Repository<ResetToken>,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.senha))) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }

  async register(body: RegisterRequestDto) {
    const user = await this.usersService.createUser(body);
    return await this.generateJwt(user);
  }

  async generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('Nenhum usuário recebido do Google');
    }

    return {
      accessToken: req.user,
    };
  }

  async sendResetPasswordEmail(
    body: ForogtPasswordRequestDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || user.tipoAutenticacao !== TipoAutenticacao.LOCAL) {
      return {
        message:
          'Se o e-mail estiver cadastrado, um código foi enviado para redefinição de senha.',
      };
    }

    const recentToken = await this.resetTokensRepository.findOne({
      where: { user: { id: user.id } },
      order: { expiraEm: 'DESC' },
    });

    if (
      !recentToken ||
      recentToken.expiraEm.getTime() < Date.now() - 5 * 60 * 1000
    ) {
      if (recentToken) {
        await this.resetTokensRepository.remove(recentToken);
      }

      const code = this.generateResetCode();
      const resetToken = this.resetTokensRepository.create({
        user,
        codigo: code,
        expiraEm: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      });

      await this.resetTokensRepository.save(resetToken);

      await this.emailService.sendUserRecoverPasswordToken(
        user.nomeCompleto,
        user.email,
        code,
      );
    }

    return {
      message:
        'Se o e-mail estiver cadastrado, um código foi enviado para redefinição de senha.',
    };
  }

  async validateResetCode(
    body: ValidateResetCodeRequestDto,
  ): Promise<ValidateResetCodeResponseDto> {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    const validTokens = await this.resetTokensRepository.find({
      where: { user: { id: user.id } },
    });

    for (const token of validTokens) {
      if (token.expiraEm < new Date()) {
        await this.resetTokensRepository.remove(token);
        continue;
      }

      const isMatch = await bcrypt.compare(body.codigo, token.codigo);
      if (isMatch) {
        return new ValidateResetCodeResponseDto(
          true,
          'Código válido. Pode prosseguir com a redefinição de senha.',
        );
      }
    }

    throw new BadRequestException('Código inválido ou expirado.');
  }
  async resetPassword(body: ResetPasswordRequestDto) {
    if (body.senha !== body.confirmacaoSenha) {
      throw new BadRequestException('As senhas não conferem.');
    }

    const user = await this.usersService.findByEmail(body.email);
    if (!user || user.tipoAutenticacao !== TipoAutenticacao.LOCAL) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const tokens = await this.resetTokensRepository.find({
      where: { user: { id: user.id } },
    });

    const resetToken = tokens.find(
      (t) =>
        t.expiraEm > new Date() && bcrypt.compareSync(body.codigo, t.codigo),
    );

    if (!resetToken) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    await this.resetTokensRepository.remove(resetToken);
    await this.usersService.updatePassword(user, body.senha);

    return new ResetPasswordResponseDto(
      true,
      'Senha alterada com sucesso. Você já pode fazer login com a nova senha.',
    );
  }

  private generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
