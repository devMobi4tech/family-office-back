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

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  senhaHash: string;

  @Column({
    name: 'foto_perfil_url',
    length: 500,
    nullable: true,
  })
  fotoPerfilUrl: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  rendaMensal: number;

  @Column({
    type: 'enum',
    enum: PerfilInvestidor,
    nullable: true,
  })
  perfilInvestidor: PerfilInvestidor;

  @Column({ nullable: true })
  comoConheceuApp: string;

  @OneToOne(() => Address, (address) => address.usuario)
  endereco: Address;

  @CreateDateColumn()
  perfilInvestidorDefinidoEm: Date;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;
}
