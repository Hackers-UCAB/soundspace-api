import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { OrmReproduccionPlaylistEntity } from './playlist-stream.entity';
<<<<<<< HEAD
import { OrmPlaylistCancionEntity } from './playlist-song.entity';
import { OrmPlaylistCreadorEntity } from './playlist-creator.entity';
import { OrmPlaylistTrendingEntity } from './playlist-trending.entity';
=======
import { PlaylistCancion } from './playlist-song.entity';
import { PlaylistCreador } from './playlist-creator.entity';
import { OrmPlaylistTrendingTrending } from './playlist-trending.entity';
>>>>>>> 615d3d03d555ba60472a01b06e62835b2283f25e

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

  @OneToMany(() => OrmPlaylistCancionEntity, playlistCancion => playlistCancion.playlist)
  canciones: OrmPlaylistCancionEntity[];

  @OneToMany(() => OrmPlaylistCreadorEntity, playlistCreador => playlistCreador.playlist)
  creadores: OrmPlaylistCreadorEntity[];

<<<<<<< HEAD
  @OneToMany(() => OrmPlaylistTrendingEntity, trending => trending.playlist)
  trending: OrmPlaylistTrendingEntity[];
=======
  @OneToMany(() => OrmPlaylistTrendingTrending, trending => trending.playlist)
  trending: OrmPlaylistTrendingTrending[];
>>>>>>> 615d3d03d555ba60472a01b06e62835b2283f25e
}
