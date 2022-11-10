import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Episodes } from './Episodes.entity';
import { History } from './History.entity';
import { WatchLater } from './Watch_later.entity';

@Entity('Series')
class Series {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ length: 4 })
  year: string;

  @Column()
  description: string;

  @Column({ default: true })
  @Exclude()
  readonly isActive: boolean;

  @Column()
  direction: string;

  @OneToMany(() => Episodes, (episodes) => episodes.series)
  episodes: Episodes[];

  @OneToMany(() => WatchLater, (watchlater) => watchlater.series)
  series: WatchLater[];

  @OneToMany(() => History, (history) => history.series)
  history: History[];
}

export { Series };
