import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Movies } from './Movies.entity';
import { Series } from './Series.entity';
import { Users } from './Users.entity';

@Entity('Ratings')
class Ratings {
    
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @Column()
    rate: number;

    @Column()
    comment: string;

    @ManyToOne(()=> Users, {eager: true})
    userId: Users

    @ManyToOne(()=>Movies, {eager: true})
    movieId: Movies

    @ManyToOne(()=>Series, {eager: true})   
    seriesId:Series
}

export {Ratings}