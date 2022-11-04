import { PrimaryGeneratedColumn, OneToOne, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Movies } from './Movies.entity';
import { Series } from './Series.entity';
import { Users } from './Users.entity';

@Entity('watch_later')
export class WatchLater {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Users, { eager: true })
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Movies, (movies) => movies.movies, { eager: true })
  movies: Movies[];

  @ManyToOne(() => Series, (series) => series.series, { eager: true })
  series: Series[];
}
