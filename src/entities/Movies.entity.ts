import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { WatchLater } from './Watch_later.entity';

@Entity('Movies')
class Movies {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  year: Date;

  @Column()
  isActive: boolean;

  @Column()
  duration: number;

  @Column()
  description: string;

  @Column()
  direction: string;

  @OneToMany(() => WatchLater, (watchlater) => watchlater.movies)
  movies: WatchLater;
}

export { Movies };
