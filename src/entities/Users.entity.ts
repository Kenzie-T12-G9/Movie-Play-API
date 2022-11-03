// prettier-ignore
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { PaymentMethods } from './PaymentMethods.entity';

@Entity('Users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({default: true})
  isActive: boolean;

  @Column()
  password: string;

  @Column()
  isAdm: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToOne(() => PaymentMethods, { eager: true })
  @JoinColumn()
  paymentMethods: PaymentMethods;
}

export { Users };
