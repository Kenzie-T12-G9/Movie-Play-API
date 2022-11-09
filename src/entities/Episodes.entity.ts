import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Series } from './Series.entity';

@Entity('Episodes')
class Episodes {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  season: number;

  @Column()
  episode: number;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column()
  description: string;

  @ManyToOne(() => Series, { onDelete: 'CASCADE' })
  series: Series;
}

export { Episodes };
