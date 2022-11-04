import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Episodes } from './Episodes.entity';
import { WatchLater } from './Watch_later.entity';

@Entity('Series')
class Series {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column()
  year: Date;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @Column()
  direction: string;

  @OneToMany(() => Episodes, (ep) => ep.serie)
  ep: Episodes[];

  @OneToMany(() => WatchLater, (watchlater) => watchlater.series)
  series: WatchLater;
}

export { Series };
