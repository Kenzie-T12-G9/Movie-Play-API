import {
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
@Entity('watch_later')
export class WatchLater {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => Users, { eager: true })
  @JoinColumn()
  user: Users;
  @OneToMany(() => Movies, (movies) => movies.titles, { nullable: true })
  movies: Movies[];
  @OneToMany(() => Series, (series) => series.titles, { nullable: true })
  series: Movies[];
}
