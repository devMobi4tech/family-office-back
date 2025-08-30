import { ApiProperty } from '@nestjs/swagger';

export class ValidateResetCodeResponseDto {
  @ApiProperty({ example: true, description: 'Indica se o código é válido' })
  isValid: boolean;

  @ApiProperty({ example: 'Código válido', description: 'Mensagem de retorno' })
  message: string;

  constructor(isValid: boolean, message: string) {
    this.isValid = isValid;
    this.message = message;
  }
}
