import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { OrmPlaylistCancionEntity } from './orm-playlist-song.entity';
import { OrmPlaylistCreadorEntity } from './orm-playlist-creator.entity';
import { OrmGeneroEntity } from './orm-genre.entity';

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

  @OneToMany(() => OrmPlaylistCancionEntity, playlistCancion => playlistCancion.playlist)
  canciones: OrmPlaylistCancionEntity[];

  @OneToMany(() => OrmPlaylistCreadorEntity, playlistCreador => playlistCreador.playlist)
    creadores: OrmPlaylistCreadorEntity[];


    static create(
        id: string,
        name: string,
        cover: string

    ): OrmPlaylistEntity {
        const Playlist = new OrmPlaylistEntity();
        Playlist.codigo_playlist = id;
        Playlist.nombre = name;
        Playlist.referencia_imagen = cover;

        return Playlist;
    }

    @ManyToOne(() => OrmGeneroEntity, (genero) => genero.playlists)
    genero: OrmGeneroEntity;
}
