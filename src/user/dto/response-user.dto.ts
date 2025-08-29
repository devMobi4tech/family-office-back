import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from 'src/address/dto/response-address.dto';

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Fernando Silva' })
  nomeCompleto: string;

  @ApiProperty({ example: 'fernando@email.com' })
  email: string;

  @ApiProperty({
    example: 'https://meuservidor.com/fotos/fernando.png',
    nullable: true,
  })
  fotoPerfilUrl?: string;

  @ApiProperty({ example: 5000.0 })
  rendaMensal: number;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  criadoEm: Date;

  @ApiProperty({ type: AddressResponseDto, nullable: true })
  endereco?: AddressResponseDto;
}
