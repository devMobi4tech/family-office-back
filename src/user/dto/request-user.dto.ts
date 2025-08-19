import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome completo é obrigatório' })
  @IsString()
  @Length(3, 255, {
    message: 'O nome completo deve ter entre 3 e 255 caracteres',
  })
  nomeCompleto: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'O CPF deve conter exatamente 11 números' })
  cpf: string;

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
