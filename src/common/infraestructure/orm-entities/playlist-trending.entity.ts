import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity('playlist_trending')
export class PlaylistTrending {
  @PrimaryGeneratedColumn('uuid')
  codigo_trending: string;

  @Column()
  fecha: Date;

  @ManyToOne(() => Playlist, playlist => playlist.trending)
  playlist: Playlist;
}
