import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { OrmArtistaEntity } from '../../../artist/infrastructure/orm-entities/artist.entity';
import { OrmCancionEntity } from '../../../song/infrastructure/persistence-entities/orm-entities/orm-song.entity';
import { OrmPlaylistEntity } from './playlist.entity';

@Entity('genero')
export class OrmGeneroEntity {

  @PrimaryGeneratedColumn('uuid')
  codigo_genero: string;

  @Column()
  nombre_genero: string;

  @ManyToMany(() => OrmCancionEntity, cancion => cancion.generos)
    canciones: OrmCancionEntity[];

    @OneToMany(() => OrmArtistaEntity, (artista) => artista.genero)
    artistas: OrmArtistaEntity[];

    @OneToMany(() => OrmPlaylistEntity, (playlist) => playlist.genero)
    playlists: OrmPlaylistEntity[];
}
