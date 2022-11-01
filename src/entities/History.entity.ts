import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne } from 'typeorm';
import { Movies } from './Movies.entity';
import { Series } from './Series.entity';
import { Users } from './Users.entity';

@Entity('History')
class History {
    
    @PrimaryGeneratedColumn('uuid')
    readonly id: string;

    @CreateDateColumn()
    watchedAt: Date;

    @Column()
    comment: string;

    @OneToOne((type)=>Users, (users)=>users.id)
    userId: Users

    @ManyToOne((type)=>Series, (series)=>series.id)
    seriesId: Series

    @ManyToOne((type)=>Movies, (movies)=>movies.id)
    movieId: Movies

}

export {History}