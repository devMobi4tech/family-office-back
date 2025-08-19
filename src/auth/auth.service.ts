import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/request-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { RequestAuthDto } from './dto/request-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(request: CreateUserDto): Promise<ResponseAuthDto> {
    const user = await this.userService.createUser(request);

    const accessToken = await this.generateToken(user);

    return new ResponseAuthDto(accessToken);
  }

  private async generateToken(user: User): Promise<string> {
    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.nomeCompleto,
      email: user.email,
    });
    return accessToken;
  }

  async login(request: RequestAuthDto): Promise<ResponseAuthDto> {
    const user = await this.userService.findByEmail(request.email);
    if (user) {
      const isMatch = await bcrypt.compare(request.senha, user.senhaHash);
      if (isMatch) {
        const accessToken = await this.generateToken(user);
        return new ResponseAuthDto(accessToken);
      }
    }
    throw new BadRequestException('E-mail ou senha incorretos.');
  }
}
