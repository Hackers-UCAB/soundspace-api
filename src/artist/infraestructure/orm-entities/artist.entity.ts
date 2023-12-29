import { OrmCancionEntity } from "../../../song/infraestructure/orm-entities/song.entity";
import { OrmPlaylistCreadorEntity } from "../../../common/infraestructure/orm-entities/playlist-creator.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrmGeneroEntity } from "../../../common/infraestructure/orm-entities/genre.entity";

@Entity('artista')
export class OrmArtistaEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_artista: string;

  @Column()
  nombre_artista: string;

  @Column()
  referencia_imagen: string;

  @Column({
    default: false
  })
  trending: boolean;

  @ManyToMany(() => OrmCancionEntity, cancion => cancion.artistas)
  canciones: OrmCancionEntity[];

  @OneToMany(() => OrmPlaylistCreadorEntity, playlistCreador => playlistCreador.artista)
  playlistCreadores: OrmPlaylistCreadorEntity[];

    @ManyToMany(() => OrmGeneroEntity, genero => genero.artistas)
    @JoinTable({
        name: 'artista_genero',
        joinColumn: {
            name: 'codigo_artista',
            referencedColumnName: 'codigo_artista'
        },
        inverseJoinColumn: {
            name: 'codigo_genero',
            referencedColumnName: 'codigo_genero'
        }
    })
    generos: OrmGeneroEntity[];

}