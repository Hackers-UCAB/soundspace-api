import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { OrmReproduccionPlaylistEntity } from './playlist-stream.entity';
import { PlaylistCancion } from './playlist-song.entity';
import { PlaylistCreador } from './playlist-creator.entity';
import { OrmPlaylistTrendingTrending } from './playlist-trending.entity';

@Entity('playlist')
export class OrmPlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_playlist: string;

  @Column()
  nombre: string;

  @Column()
  referencia_imagen: string;

  @Column()
  tipo: string;

  @OneToMany(() => OrmReproduccionPlaylistEntity, reproduccion => reproduccion.playlist)
  reproducciones: OrmReproduccionPlaylistEntity[];

  @OneToMany(() => PlaylistCancion, playlistCancion => playlistCancion.playlist)
  canciones: PlaylistCancion[];

  @OneToMany(() => PlaylistCreador, playlistCreador => playlistCreador.playlist)
  creadores: PlaylistCreador[];

  @OneToMany(() => OrmPlaylistTrendingTrending, trending => trending.playlist)
  trending: OrmPlaylistTrendingTrending[];
}
