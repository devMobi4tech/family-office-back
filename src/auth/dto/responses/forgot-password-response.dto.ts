import { ApiProperty } from '@nestjs/swagger';

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
