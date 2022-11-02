import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
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

  @OneToOne(() => Users, (users) => users.id)
  user: Users;

  @ManyToOne(() => Series, (series) => series.id)
  series: Series;

  @ManyToOne(() => Movies, (movies) => movies.id)
  movie: Movies;
}

export { History };
