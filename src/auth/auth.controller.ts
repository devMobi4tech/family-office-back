import { Body, Controller, Post } from '@nestjs/common';
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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
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
    description: 'Email de redefinição enviado caso exista usuário cadastrado',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(
    @Body() request: ForogtPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    return await this.authService.forgotPassword(request);
  }

  @Post('/validate-reset-token')
  @ApiOperation({ summary: 'Valida token de redefinição de senha' })
  @ApiBody({ type: ValidateResetTokenRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    type: ValidateResetTokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
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
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async resetPassword(
    @Body() request: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return await this.authService.resetPassword(request);
  }
}
