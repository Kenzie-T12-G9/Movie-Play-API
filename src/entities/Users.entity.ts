// prettier-ignore
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { PaymentMethods } from './PaymentMethods.entity';
import { Exclude } from 'class-transformer';

@Entity('Users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  isActive: boolean;

  @Column()
  @Exclude()
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
