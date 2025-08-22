import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('reset_tokens')
export class ResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.resetTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  codigo: string;

  @CreateDateColumn({ type: 'timestamp' })
  criadoEm: Date;

  @Column({ type: 'timestamp' })
  expiraEm: Date;

  @BeforeInsert()
  async hashCode() {
    this.codigo = await bcrypt.hash(this.codigo, 10);
  }
}
