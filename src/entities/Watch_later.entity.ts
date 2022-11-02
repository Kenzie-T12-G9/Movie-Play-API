import {
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
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
  @OneToMany(() => Movies, (movies) => movies.watchlater, { nullable: true })
  movies: Movies[];
  @OneToMany(() => Series, (series) => series.watchlater, { nullable: true })
  series: Series[];
}
