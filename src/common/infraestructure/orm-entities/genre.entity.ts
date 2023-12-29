import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';
import { OrmCancionEntity } from '../../../song/infraestructure/orm-entities/song.entity';

@Entity('genero')
export class OrmGeneroEntity {

  @PrimaryGeneratedColumn('uuid')
  codigo_genero: string;

  @Column()
  nombre_genero: string;

  @ManyToMany(() => OrmCancionEntity, cancion => cancion.generos)
    canciones: OrmCancionEntity[];

    @ManyToMany(() => OrmArtistaEntity, artista => artista.generos)
    artistas: OrmArtistaEntity[];
}
