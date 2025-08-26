import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  TokenResponseDto,
  ValidateResetTokenResponseDto,
} from './dto/response-auth.dto';
import {
  ForogtPasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ResetPasswordRequestDto,
  ValidateResetTokenRequestDto,
} from './dto/request-auth.dto';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Algum dado único já existe (ex.: email)',
  })
  async register(
    @Body() request: RegisterRequestDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.register(request);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Realiza login do usuário' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    type: TokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Email ou senha inválidos' })
  async login(@Body() request: LoginRequestDto): Promise<TokenResponseDto> {
    return await this.authService.login(request);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Solicita redefinição de senha' })
  @ApiBody({ type: ForogtPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description:
      'E-mail com código de redefinição de senha enviado caso exista usuário cadastrado',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() request: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(request);
  }

  @Post('/validate-reset-token')
  @ApiOperation({ summary: 'Valida código de redefinição de senha' })
  @ApiBody({ type: ValidateResetTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Código válido',
    type: ValidateResetTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido ou expirado',
  })
  async validateResetToken(
    @Body() request: ValidateResetTokenRequestDto,
  ): Promise<ValidateResetTokenResponseDto> {
    return await this.authService.validateResetToken(request);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Redefine a senha do usuário' })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido ou expirado/senhas não coincidem',
  })
  async resetPassword(
    @Body() request: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return await this.authService.resetPassword(request);
  }

  @Get('/google/login')
  @ApiOperation({ summary: 'Redireciona para login via Google' })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento para o Google OAuth',
  })
  async googleLogin(@Res() res: Response) {
    const url = this.authService.getGoogleCallbackUrl();
    return res.redirect(url);
  }

  @Get('/google/callback')
  @ApiOperation({ summary: 'Callback do Google OAuth' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Código de autorização fornecido pelo Google',
  })
  @ApiResponse({
    status: 200,
    description: 'Login via Google bem-sucedido. Retorna access token',
    schema: {
      example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR...' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erros possíveis para requisições inválidas',
    example: {
      statusCode: 400,
      message:
        'Este email já está cadastrado com senha. Use login tradicional.',
    },
  })
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const { accessToken: string } =
      await this.authService.loginUserWithGoogle(code);

    return res.json({ accessToken: string });
  }
}
