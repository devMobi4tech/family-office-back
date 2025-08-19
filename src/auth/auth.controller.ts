import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/request-user.dto';
import { AuthService } from './auth.service';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { RequestAuthDto } from './dto/request-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() request: CreateUserDto): Promise<ResponseAuthDto> {
    return await this.authService.register(request);
  }

  @Post('/login')
  async login(@Body() request: RequestAuthDto): Promise<ResponseAuthDto> {
    return await this.authService.login(request);
  }
}
