import { IsEnum, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TiposDeInvestidor } from 'src/investor-profile/entities/investor-profile.entity';

export class UpdateInvestorProfileRequestDto {
  @ApiProperty({
    description: 'Novo perfil de investidor do usuário',
    enum: TiposDeInvestidor,
    example: TiposDeInvestidor.MODERADO,
  })
  @IsNotEmpty({ message: 'O perfil do investidor é obrigatório.' })
  @IsEnum(TiposDeInvestidor, { message: 'Perfil de investidor inválido.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  perfilInvestidor: TiposDeInvestidor;
}
