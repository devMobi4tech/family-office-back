import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

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
