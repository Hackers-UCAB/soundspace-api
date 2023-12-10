import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { ReproduccionPlaylist } from './playlist-stream.entity';
import { PlaylistCancion } from './playlist-song.entity';
import { PlaylistCreador } from './playlist-creator.entity';
import { PlaylistTrending } from './playlist-trending.entity';

@Entity('playlist')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  codigo_playlist: string;

  @Column()
  nombre: string;

  @Column()
  referencia_imagen: string;

  @Column()
  tipo: string;

  @OneToMany(() => ReproduccionPlaylist, reproduccion => reproduccion.playlist)
  reproducciones: ReproduccionPlaylist[];

  @OneToMany(() => PlaylistCancion, playlistCancion => playlistCancion.playlist)
  canciones: PlaylistCancion[];

  @OneToMany(() => PlaylistCreador, playlistCreador => playlistCreador.playlist)
  creadores: PlaylistCreador[];

  @OneToMany(() => PlaylistTrending, trending => trending.playlist)
  trending: PlaylistTrending[];
}
