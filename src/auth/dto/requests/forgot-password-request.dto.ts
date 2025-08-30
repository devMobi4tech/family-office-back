import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForogtPasswordRequestDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário para redefinição de senha',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
