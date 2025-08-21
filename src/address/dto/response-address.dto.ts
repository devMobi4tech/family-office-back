import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se a atualização foi realizada com sucesso',
  })
  success: boolean;

  @ApiProperty({
    example: 'Endereço atualizado com sucesso',
    description: 'Mensagem de retorno',
  })
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}
