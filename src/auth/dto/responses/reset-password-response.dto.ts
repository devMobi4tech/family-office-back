import { ApiProperty } from '@nestjs/swagger';

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
