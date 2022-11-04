import { Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, ManyToOne } from 'typeorm';
import { Movies } from './Movies.entity';
import { Series } from './Series.entity';
import { Users } from './Users.entity';

@Entity('History')
class History {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @CreateDateColumn()
  watchedAt: Date;

  @OneToOne(() => Users, (users) => users.id)
  user: Users;

  @ManyToOne(() => Series, (series) => series.id, { nullable: true })
  series: Series;

  @ManyToOne(() => Movies, (movies) => movies.id, { nullable: true })
  movie: Movies;
}

export { History };
