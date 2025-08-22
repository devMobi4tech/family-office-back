import { Address } from 'src/address/entities/address.entity';
import { ResetToken } from 'src/auth/entities/reset_token.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum PerfilInvestidor {
  CONSERVADOR = 'CONSERVADOR',
  MODERADO = 'MODERADO',
  ARROJADO = 'ARROJADO',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  senha: string;

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

  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];

  @OneToOne(() => Address, (address) => address.usuario)
  endereco: Address;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @BeforeUpdate()
  @BeforeInsert()
  private async hashPassword() {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
}
