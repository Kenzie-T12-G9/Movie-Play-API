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

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToOne((type) => PaymentMethods, {eager: true})
    @JoinColumn()
    PaymentMethods: PaymentMethods

}

export {Users}