import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { OrmGeneroEntity } from '../../../common/infraestructure/orm-entities/genre.entity';
import { ReproduccionCancion } from '../../../common/infraestructure/orm-entities/song-streamed.entity';
import { PlaylistCancion } from '../../../common/infraestructure/orm-entities/playlist-song.entity';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';

@Entity('cancion')
export class OrmCancionEntity {

  @PrimaryGeneratedColumn('uuid')
  codigo_cancion: string;

  @Column()
  nombre_cancion: string;

  @Column()
  duracion: number;

  @Column({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({
    unique: true
  })
  referencia_cancion: string;

  @Column({
    unique: true
  })
  referencia_preview: string;

  @Column()
  referencia_imagen: string;

  @ManyToMany(() => OrmGeneroEntity, genero => genero.canciones)
  @JoinTable({
    name: 'cancion_genero',
    joinColumn: {
      name: 'codigo_cancion',
      referencedColumnName: 'codigo_cancion'
    },
    inverseJoinColumn: {
      name: 'codigo_genero',
      referencedColumnName: 'codigo_genero'
    }
  })
  generos: OrmGeneroEntity[];

  @ManyToMany(() => OrmArtistaEntity, artista => artista.canciones)
  @JoinTable({
    name: 'cancion_artista',
    joinColumn: {
      name: 'codigo_cancion',
      referencedColumnName: 'codigo_cancion'
    },
    inverseJoinColumn: {
      name: 'codigo_artista',
      referencedColumnName: 'codigo_artista'
    }
  })
  artistas: OrmArtistaEntity[];

  @OneToMany(() => ReproduccionCancion, reproduccionCancion => reproduccionCancion.cancion)
  reproduccionesCanciones: ReproduccionCancion[];

  @OneToMany(() => PlaylistCancion, playlistCancion => playlistCancion.cancion)
  playlistCanciones: PlaylistCancion[];
}
