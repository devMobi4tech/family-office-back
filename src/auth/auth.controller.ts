import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/response-auth.dto';
import { LoginRequestDto, RegisterRequestDto } from './dto/request-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() request: RegisterRequestDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.register(request);
  }

  @Post('/login')
  async login(@Body() request: LoginRequestDto): Promise<TokenResponseDto> {
    return await this.authService.login(request);
  }
}
