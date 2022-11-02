import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Episodes, ep => ep.serie) 
  ep: Episodes[];
}

export { Series };
