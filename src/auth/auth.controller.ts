import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordResponseDto,
  TokenResponseDto,
  ValidateResetTokenResponseDto,
} from './dto/response-auth.dto';
import {
  ForogtPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ValidateResetTokenRequestDto,
} from './dto/request-auth.dto';

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

  @Post('/forgot-password')
  async forgotPassword(
    @Body() request: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(request);
  }

  @Post('/validate-reset-token')
  async validateResetToken(
    @Body() request: ValidateResetTokenRequestDto,
  ): Promise<ValidateResetTokenResponseDto> {
    return await this.authService.validateResetToken(request);
  }
}
