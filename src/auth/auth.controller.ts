import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { ForogtPasswordRequestDto } from './dto/requests/forgot-password-request.dto';
import { ForgotPasswordResponseDto } from './dto/responses/forgot-password-response.dto';
import { ValidateResetCodeRequestDto } from './dto/requests/validate-reset-code-request.dto';
import { ValidateResetCodeResponseDto } from './dto/responses/validate-reset-code-response.dto';
import { AuthService } from './auth.service';
import { ResetPasswordRequestDto } from './dto/requests/reset-password-request.dto';
import { ResetPasswordResponseDto } from './dto/responses/reset-password-response.dto';
import { RegisterRequestDto } from './dto/requests/register-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.generateJwt(req.user);
  }

  @Get('/google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req) {
    return await this.authService.generateJwt(req.user);
  }

  @Post('forgot-password')
  async sendResetEmail(
    @Body() body: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.sendResetPasswordEmail(body);
  }

  @Post('validate-reset-code')
  async validateResetCode(
    @Body() body: ValidateResetCodeRequestDto,
  ): Promise<ValidateResetCodeResponseDto> {
    return this.authService.validateResetCode(body);
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    body: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(body);
  }
}
