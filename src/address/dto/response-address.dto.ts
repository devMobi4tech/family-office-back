import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({ example: '12345678' })
  cep: string;

  @ApiProperty({ example: 'Rua das Flores' })
  endereco: string;

  @ApiProperty({ example: 'SP' })
  estado: string;

  @ApiProperty({ example: 'São Paulo' })
  cidade: string;

  @ApiProperty({ example: 'Jardim Paulista' })
  bairro: string;

  @ApiProperty({ example: 'Apto 45', required: false })
  complemento?: string;

  @ApiProperty({ example: '100' })
  numero: string;
}
