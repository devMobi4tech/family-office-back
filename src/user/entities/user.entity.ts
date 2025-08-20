import { Address } from 'src/address/entities/address.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

export enum PerfilInvestidor {
  CONSERVADOR = 'CONSERVADOR',
  MODERADO = 'MODERADO',
  ARROJADO = 'ARROJADO',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nomeCompleto: string;

  @Column({ length: 11, unique: true })
  cpf: string;

  @Column({ type: 'date' })
  dataNascimento: Date;

  @Column({ length: 50 })
  origemUsuario: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  senhaHash: string;

  @Column({
    length: 500,
    nullable: true,
  })
  fotoPerfilUrl: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  rendaMensal: number;

  @Column({
    type: 'enum',
    enum: PerfilInvestidor,
    nullable: true,
  })
  perfilInvestidor: PerfilInvestidor;

  @Column({ type: Date, nullable: true })
  perfilInvestidorDefinidoEm?: Date;

  @OneToOne(() => Address, (address) => address.usuario)
  endereco: Address;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
