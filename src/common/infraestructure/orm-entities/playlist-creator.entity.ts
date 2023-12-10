import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Artista } from '../../../artist/infraestructure/orm-entities/artist.entity';

@Entity('playlist_creador')
export class PlaylistCreador {
  
  @PrimaryGeneratedColumn('uuid')
  codigo_playlist_creador: number;
  
  // @PrimaryColumn()
  // playlistId: number;

  // @PrimaryColumn('uuid')
  // codigo_artista: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @ManyToOne(() => Playlist, playlist => playlist.creadores)
  // @JoinColumn({ name: "playlistId" })
  playlist: Playlist;

  @ManyToOne(() => Artista, artista => artista.playlistCreadores)
  // @JoinColumn({ name: "codigo_artista" })
  artista: Artista;
}
