import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrmPlaylistEntity } from './playlist.entity';

@Entity('playlist_trending')
export class OrmPlaylistTrendingTrending {
  @PrimaryGeneratedColumn('uuid')
  codigo_trending: string;

  @Column()
  fecha: Date;

  @ManyToOne(() => OrmPlaylistEntity, playlist => playlist.trending)
  playlist: OrmPlaylistEntity;
}
