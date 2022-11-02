import { ManyToOne, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
  duration: number;

  @Column()
  description: string;

  @Column()
  direction: string;

  @ManyToOne(() => WatchLater, { eager: true, nullable: true })
  watchlater: WatchLater;
}

export { Movies };
