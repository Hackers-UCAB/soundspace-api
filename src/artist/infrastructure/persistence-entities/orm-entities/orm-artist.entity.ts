import { OrmCancionEntity } from "../../../../song/infrastructure/persistence-entities/orm-entities/orm-song.entity";
import { OrmPlaylistCreadorEntity } from "../../../../common/infrastructure/persistence-entities/orm-entities/orm-playlist-creator.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrmGeneroEntity } from "../../../../common/infrastructure/persistence-entities/orm-entities/orm-genre.entity";
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
  //Hay que pullear
  @ManyToOne(() => OrmGeneroEntity, (genero) => genero.artistas)
  genero: OrmGeneroEntity;

}