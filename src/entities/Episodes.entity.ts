import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Episodes')
class Episodes {

    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column()
    season: number;

    @Column()
    episode: number;

    @Column()
    name: string;

    @Column()
    duration: number;

    @Column()
    description: string;

}

export {Episodes}