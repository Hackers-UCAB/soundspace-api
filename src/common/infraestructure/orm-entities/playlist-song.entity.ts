import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Cancion } from '../../../song/infraestructure/orm-entities/song.entity';

@Entity('playlist_cancion')
export class PlaylistCancion {
  // @PrimaryColumn()
  // playlistId: number;

  @PrimaryGeneratedColumn('uuid')
  codigo_playlist_cancion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_union: Date;

  @ManyToOne(() => Playlist, playlist => playlist.canciones)
  // @JoinColumn({ name: "playlistId" })
  playlist: Playlist;

  @ManyToOne(() => Cancion, cancion => cancion.playlistCanciones)
  // @JoinColumn({ name: "codigo_cancion" })
  cancion: Cancion;
}
