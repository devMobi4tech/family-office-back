import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @IsString({ message: 'O CEP deve ser uma string.' })
  @Length(8, 8, { message: 'O CEP deve ter 8 numeros.' })
  cep: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço deve ser uma string.' })
  endereco: string;

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  @IsString({ message: 'O estado deve ser uma string.' })
  estado: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @IsString({ message: 'A cidade deve ser uma string.' })
  cidade: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @IsString({ message: 'O bairro deve ser uma string.' })
  bairro: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @Transform(({ value }) => value ?? '')
  complemento?: string;

  @IsNotEmpty({ message: 'O número do endereço é obrigatório.' })
  @IsString({ message: 'O número do endereço deve ser uma string.' })
  numero: string;
}
