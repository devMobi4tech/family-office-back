import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reset_tokens')
export class ResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.resetTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  tokenHash: string;

  @CreateDateColumn({ type: 'timestamp' })
  criadoEm: Date;

  @Column({ type: 'timestamp' })
  expiraEm: Date;

  @Column({
    type: 'enum',
    enum: ['ativo', 'usado', 'expirado'],
    default: 'ativo',
  })
  status: 'ativo' | 'usado' | 'expirado';
}
