// prettier-ignore
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { PaymentMethods } from './PaymentMethods.entity';
import { Exclude } from 'class-transformer';
import { History } from './History.entity';

@Entity('Users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  isAdm: boolean;

  @Column({ default: true })
  @Exclude()
  readonly isActive: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => PaymentMethods, { eager: true })
  @JoinColumn()
  paymentMethods: PaymentMethods;

  @OneToMany(() => History, (history) => history.user)
  user: History[];
}

export { Users };
