import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { OrmReproduccionPlaylistEntity } from './playlist-stream.entity';
import { OrmPlaylistCancionEntity } from './playlist-song.entity';
import { OrmPlaylistCreadorEntity } from './playlist-creator.entity';
import { OrmPlaylistTrendingEntity } from './playlist-trending.entity';

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

  @OneToMany(() => OrmPlaylistTrendingEntity, trending => trending.playlist)
  trending: OrmPlaylistTrendingEntity[];
}
