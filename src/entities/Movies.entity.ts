import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { History } from './History.entity';
import { WatchLater } from './Watch_later.entity';
import { Exclude } from 'class-transformer';

@Entity('Movies')
class Movies {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ length: 4 })
  year: string;

  @Column({ default: true })
  @Exclude()
  readonly isActive: boolean;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column()
  direction: string;

  @OneToMany(() => WatchLater, (watchlater) => watchlater.movies)
  watchLater: WatchLater[];

  @OneToMany(() => History, (history) => history.movie)
  history: History[];
}

export { Movies };
