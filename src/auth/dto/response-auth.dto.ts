import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de acesso JWT',
  })
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'Email de redefinição enviado com sucesso',
    description: 'Mensagem de retorno',
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class ValidateResetTokenResponseDto {
  @ApiProperty({ example: true, description: 'Indica se o token é válido' })
  isValid: boolean;

  @ApiProperty({ example: 'Token válido', description: 'Mensagem de retorno' })
  message: string;

  constructor(isValid: boolean, message: string) {
    this.isValid = isValid;
    this.message = message;
  }
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se a senha foi redefinida com sucesso',
  })
  success: boolean;

  @ApiProperty({
    example: 'Senha redefinida com sucesso',
    description: 'Mensagem de retorno',
  })
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
