import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso e JWT gerado.',
  })
  @ApiResponse({ status: 400, description: 'As senhas não conferem.' })
  @ApiResponse({
    status: 409,
    description: 'Dados únicos já cadastrados. (ex: E-mail, CPF...)',
  })
  async register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Login com e-mail e senha' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'fulano@example.com' },
        senha: { type: 'string', example: 'Senha@123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido com JWT.' })
  @ApiResponse({ status: 400, description: 'Credenciais inválidas.' })
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.generateJwt(req.user);
  }

  @Get('/google/login')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Inicia o fluxo de login via Google OAuth' })
  async googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Callback do Google OAuth' })
  @ApiResponse({
    status: 200,
    description: 'Login via Google bem-sucedido com JWT.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Usuário já cadastrado com e-mail e senha (login tradicional).',
  })
  async googleAuthRedirect(@Request() req) {
    return await this.authService.generateJwt(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar código de redefinição de senha' })
  @ApiBody({ type: ForogtPasswordRequestDto })
  @ApiResponse({ status: 200, type: ForgotPasswordResponseDto })
  @HttpCode(200)
  async sendResetEmail(
    @Body() body: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return this.authService.sendResetPasswordEmail(body);
  }

  @Post('validate-reset-code')
  @ApiOperation({ summary: 'Validar código de redefinição de senha' })
  @ApiBody({ type: ValidateResetCodeRequestDto })
  @ApiResponse({ status: 200, type: ValidateResetCodeResponseDto })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado.' })
  @HttpCode(200)
  async validateResetCode(
    @Body() body: ValidateResetCodeRequestDto,
  ): Promise<ValidateResetCodeResponseDto> {
    return this.authService.validateResetCode(body);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefinir senha com código válido' })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({ status: 200, type: ResetPasswordResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, expirado ou senhas não conferem.',
  })
  @HttpCode(200)
  async resetPassword(
    @Body()
    body: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPassword(body);
  }
}
