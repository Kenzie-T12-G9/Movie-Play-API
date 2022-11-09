import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { Movies } from './Movies.entity';
import { Series } from './Series.entity';
import { Users } from './Users.entity';

@Entity('History')
class History {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @CreateDateColumn()
  watchedAt: Date;

  @Column()
  isActive: boolean;

  @ManyToOne(() => Users, { eager:true }) 
  user: Users;

  @ManyToOne(() => Series, { eager: true })
  series?: Series;

  @ManyToOne(() => Movies, { eager: true })
  movie?: Movies;
}

export { History };
