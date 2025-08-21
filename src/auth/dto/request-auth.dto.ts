import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;
}

export class RegisterRequestDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @IsString()
  @Length(3, 255, {
    message: 'O nome completo deve ter entre 3 e 255 caracteres',
  })
  nomeCompleto: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, { message: 'CPF inválido' })
  @Transform(({ value }) => value.replace(/\D/g, ''))
  cpf: string;

  @IsNotEmpty({ message: 'O campo renda mensal é obrigatório' })
  @IsNumber({}, { message: 'Renda mensal deve ser um número' })
  @Min(0, { message: 'Renda mensal não pode ser negativa' })
  @Transform(({ value }) => Number(value))
  rendaMensal: number;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  @Length(10, 10, { message: 'A data de nascimento deve ter 10 caracteres' }) // DD/MM/AAAA
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Data de nascimento deve estar no formato DD/MM/AAAA',
  })
  dataNascimento: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Senha fraca. Use pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
    },
  )
  senha: string;

  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  confirmacaoSenha: string;

  @IsNotEmpty({ message: 'O campo origem do usuário é obrigatório' })
  @MaxLength(50, {
    message: 'O campo origem do usuário deve ter no máximo 50 caracteres',
  })
  origemUsuario: string;
}

export class ForogtPasswordRequestDto {
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;
}

export class ValidateResetTokenRequestDto {
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'O token é obrigatório' })
  @Length(6, 6, { message: 'O token deve conter exatamente 6 dígitos' })
  @IsString({ message: 'O token deve ser enviado em forma de string' })
  token: string;

  constructor(email: string, token: string) {
    this.email = email;
    this.token = token;
  }
}

export class ResetPasswordRequestDto {
  @IsNotEmpty({ message: 'O token é obrigatório' })
  @Length(6, 6, { message: 'O token deve conter exatamente 6 dígitos' })
  @IsString({ message: 'O token deve ser enviado em forma de string' })
  token: string;

  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Senha fraca. Use pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
    },
  )
  senha: string;

  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  confirmacaoSenha: string;
}
