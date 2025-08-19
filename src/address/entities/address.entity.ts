import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('enderecos')
export class Address {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  cep: string;

  @Column()
  endereco: string;

  @Column()
  estado: string;

  @Column()
  cidade: string;

  @Column()
  bairro: string;

  @Column({ nullable: true })
  complemento?: string;

  @Column()
  numero: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  usuario: User;
}
