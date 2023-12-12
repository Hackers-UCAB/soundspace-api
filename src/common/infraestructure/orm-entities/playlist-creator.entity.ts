import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrmPlaylistEntity } from './playlist.entity';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';

@Entity('playlist_creador')
export class OrmPlaylistCreadorEntity {
  
  @PrimaryGeneratedColumn('uuid')
  codigo_playlist_creador: number;
  
  // @PrimaryColumn()
  // playlistId: number;

  // @PrimaryColumn('uuid')
  // codigo_artista: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @ManyToOne(() => OrmPlaylistEntity, playlist => playlist.creadores)
  // @JoinColumn({ name: "playlistId" })
  playlist: OrmPlaylistEntity;

  @ManyToOne(() => OrmArtistaEntity, artista => artista.playlistCreadores)
  // @JoinColumn({ name: "codigo_artista" })
  artista: OrmArtistaEntity;
}
