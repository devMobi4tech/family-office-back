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
import { InvestorProfile } from 'src/investor-profile/entities/investor-profile.entity';

export enum TipoAutenticacao {
  LOCAL = 'LOCAL', // Usuário com email e senha
  GOOGLE = 'GOOGLE', // Usuário via Google OAuth
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  nomeCompleto: string;

  @Column({ length: 11, unique: true, nullable: true })
  cpf: string;

  @Column({ type: 'date', nullable: true })
  dataNascimento: Date;

  @Column({ length: 50, nullable: true })
  origemUsuario: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, nullable: true })
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
    nullable: true,
  })
  rendaMensal: number;

  @OneToMany(() => InvestorProfile, (investorProfile) => investorProfile.user)
  perfilInvestidor: InvestorProfile[];

  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];

  @OneToOne(() => Address, (address) => address.usuario)
  endereco: Address;

  @Column({
    type: 'enum',
    enum: TipoAutenticacao,
    default: TipoAutenticacao.LOCAL,
    nullable: false,
  })
  tipoAutenticacao: TipoAutenticacao;

  @CreateDateColumn()
  criadoEm: Date;

  @UpdateDateColumn()
  atualizadoEm: Date;

  @BeforeUpdate()
  @BeforeInsert()
  private async hashPassword() {
    if (this.senha) {
      this.senha = await bcrypt.hash(this.senha, 10);
    }
  }
}
