import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TiposDeInvestidor {
  CONSERVADOR = 'CONSERVADOR',
  MODERADO = 'MODERADO',
  ARROJADO = 'ARROJADO',
}

@Entity('perfil_de_investidores')
export class InvestorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TiposDeInvestidor,
    nullable: false,
  })
  perfilInvestidor: TiposDeInvestidor;

  @CreateDateColumn()
  inicioEm: Date;

  @Column({ type: Date, nullable: true })
  fimEm: Date;

  @ManyToOne(() => User, (user) => user.perfilInvestidor, {
    onDelete: 'CASCADE',
  })
  user: User;
}
