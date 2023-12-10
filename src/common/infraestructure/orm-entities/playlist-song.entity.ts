import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrmPlaylistEntity } from './playlist.entity';
import { OrmCancionEntity } from '../../../song/infraestructure/orm-entities/song.entity';

@Entity('playlist_cancion')
export class PlaylistCancion {
  // @PrimaryColumn()
  // playlistId: number;

  @PrimaryGeneratedColumn('uuid')
  codigo_playlist_cancion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_union: Date;

  @ManyToOne(() => OrmPlaylistEntity, playlist => playlist.canciones)
  // @JoinColumn({ name: "playlistId" })
  playlist: OrmPlaylistEntity;

  @ManyToOne(() => OrmCancionEntity, cancion => cancion.playlistCanciones)
  // @JoinColumn({ name: "codigo_cancion" })
  cancion: OrmCancionEntity;
}
