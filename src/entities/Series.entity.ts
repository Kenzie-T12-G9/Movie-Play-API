import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Episodes } from './Episodes.entity';

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
  direction: string;

  @ManyToOne(() => Episodes, (episodes) => episodes.id)
  espisode: Episodes;
}

export { Series };