import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Movies')
class Movies {

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column()
    name: string;

    @Column()
    year: Date;

    @Column()
    duration: number;

    @Column()
    description: string;

    @Column()
    direction: string;
    
}

export {Movies}