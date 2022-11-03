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

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Movies, { nullable: true })
  movie: Movies;

  @ManyToOne(() => Series, { nullable: true })
  series: Series;
}

export { Ratings };
