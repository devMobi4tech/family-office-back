import { IsNotEmpty } from 'class-validator';

export class RequestAuthDto {
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  senha: string;
}
