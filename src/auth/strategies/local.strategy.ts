import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'senha',
    });
  }

  async validate(email: string, senha: string): Promise<any> {
    const user = await this.authService.validateUser(email, senha);
    if (!user) {
      throw new BadRequestException('E-mail ou senha inválidos.');
    }
    return user;
  }
}
