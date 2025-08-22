import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @ApiProperty({ example: 'Senha@123', description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;
}

export class RegisterRequestDto {
  @ApiProperty({
    example: 'Fulano da Silva',
    description: 'Nome completo do usuário',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  nomeCompleto: string;

  @ApiProperty({
    example: '12345678909',
    description: 'CPF do usuário, apenas números',
  })
  @IsNotEmpty()
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
  @Transform(({ value }) => value.replace(/\D/g, ''))
  cpf: string;

  @ApiProperty({ example: 4500, description: 'Renda mensal em reais' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  rendaMensal: number;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Data de nascimento AAAA-MM-DD',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toISOString().split('T')[0], {
    toPlainOnly: true,
  })
  @IsDateString(
    {},
    { message: 'dataNascimento deve estar no formato AAAA-MM-DD' },
  )
  dataNascimento: Date;

  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Senha@123', description: 'Senha do usuário' })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  senha: string;

  @ApiProperty({ example: 'Senha@123', description: 'Confirmação da senha' })
  @IsNotEmpty()
  confirmacaoSenha: string;

  @ApiProperty({
    example: 'Facebook',
    description: 'Por onde o usuário conheceu o app',
  })
  @IsNotEmpty()
  @MaxLength(50)
  origemUsuario: string;
}

export class ForogtPasswordRequestDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário para redefinição de senha',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ValidateResetTokenRequestDto {
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

export class ResetPasswordRequestDto {
  @ApiProperty({
    example: '123456',
    description: 'Código de redefinição recebido por email',
  })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'NovaSenha@123',
    description: 'Nova senha do usuário',
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  senha: string;

  @ApiProperty({
    example: 'NovaSenha@123',
    description: 'Confirmação da nova senha',
  })
  @IsNotEmpty()
  confirmacaoSenha: string;
}
