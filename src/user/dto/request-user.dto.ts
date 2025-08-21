import { IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PerfilInvestidor } from '../entities/user.entity';

export class UpdateInvestorProfileRequestDto {
  @ApiProperty({
    description: 'Novo perfil de investidor do usuário',
    enum: PerfilInvestidor,
    example: PerfilInvestidor.MODERADO,
  })
  @IsNotEmpty({ message: 'O perfil do investidor é obrigatório.' })
  @IsEnum(PerfilInvestidor, { message: 'Perfil de investidor inválido.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  perfilInvestidor: PerfilInvestidor;
}
