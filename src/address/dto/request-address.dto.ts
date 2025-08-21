import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: '01001000', description: 'CEP com 8 números' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 8, { message: 'O CEP deve ter 8 numeros.' })
  cep: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Nome do logradouro / endereço',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço deve ser uma string.' })
  endereco: string;

  @ApiProperty({ example: 'SP', description: 'Estado' })
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  estado: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  cidade: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  bairro: string;

  @ApiPropertyOptional({
    example: 'Apto 101',
    description: 'Complemento (opcional)',
  })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @Transform(({ value }) => value ?? '')
  complemento?: string;

  @ApiProperty({ example: '123', description: 'Número da residência' })
  @IsNotEmpty({ message: 'O número do endereço é obrigatório.' })
  @IsString({ message: 'O número do endereço deve ser uma string.' })
  numero: string;
}
