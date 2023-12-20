import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { OrmReproduccionPlaylistEntity } from './playlist-stream.entity';
import { OrmPlaylistCancionEntity } from './playlist-song.entity';
import { OrmPlaylistCreadorEntity } from './playlist-creator.entity';

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

  @Column({
    default: false
  })
  trending: boolean;

  @OneToMany(() => OrmReproduccionPlaylistEntity, reproduccion => reproduccion.playlist)
  reproducciones: OrmReproduccionPlaylistEntity[];

  @OneToMany(() => OrmPlaylistCancionEntity, playlistCancion => playlistCancion.playlist)
  canciones: OrmPlaylistCancionEntity[];

  @OneToMany(() => OrmPlaylistCreadorEntity, playlistCreador => playlistCreador.playlist)
  creadores: OrmPlaylistCreadorEntity[];

}
