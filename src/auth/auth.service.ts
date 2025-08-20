import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginRequestDto, RegisterRequestDto } from './dto/request-auth.dto';
import { TokenResponseDto } from './dto/response-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
}
