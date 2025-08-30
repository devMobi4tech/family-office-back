import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateResetCodeRequestDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de redefinição recebido por email',
  })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  constructor(email: string, codigo: string) {
    this.email = email;
    this.codigo = codigo;
  }
}
