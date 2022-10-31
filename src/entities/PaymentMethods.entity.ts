import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PaymentMethods')
class PaymentMethods {
    
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column({length: 45})
    name: string;

    @Column({length: 11})
    cpf: string;

    @Column({length: 16})
    number: string;

    @Column()
    dueDate: Date;

    @Column()
    code: string;

}

export {PaymentMethods}