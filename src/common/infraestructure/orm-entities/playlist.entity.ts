import { Column, Entity, OneToMany, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { OrmPlaylistCancionEntity } from './playlist-song.entity';
import { OrmPlaylistCreadorEntity } from './playlist-creator.entity';
import { OrmGeneroEntity } from './genre.entity';

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

    @ManyToMany(() => OrmGeneroEntity, albums => albums.artistas)
    @JoinTable({
        name: 'playlist_genero',
        joinColumn: {
            name: 'codigo_playlist',
            referencedColumnName: 'codigo_playlist'
        },
        inverseJoinColumn: {
            name: 'codigo_genero',
            referencedColumnName: 'codigo_genero'
        }
    })
    generos: OrmGeneroEntity[];

}
