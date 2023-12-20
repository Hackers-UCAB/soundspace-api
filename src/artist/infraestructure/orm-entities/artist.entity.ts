import { OrmCancionEntity } from "../../../song/infraestructure/orm-entities/song.entity";
import { OrmPlaylistCreadorEntity } from "../../../common/infraestructure/orm-entities/playlist-creator.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

}