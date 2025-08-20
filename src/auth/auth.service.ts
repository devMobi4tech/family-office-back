import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import {
  ForogtPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
} from './dto/request-auth.dto';
import {
  ForgotPasswordResponseDto,
  TokenResponseDto,
} from './dto/response-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetToken } from './entities/reset_token.entity';
import { Repository } from 'typeorm';

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
      const agoraUTC = new Date();
      const token = this.resetTokensRepository.create({
        user,
        tokenHash: await bcrypt.hash(this.generateResetCode(), 10),
        expiraEm: new Date(agoraUTC.getTime() + 3 * 60 * 1000),
      });
      // TODO: Enviar token para e-mail
      await this.resetTokensRepository.save(token);
    }
    return new ForgotPasswordResponseDto(
      'Se existir uma conta com este e-mail, um link de redefinição foi enviado.',
    );
  }

  private generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
