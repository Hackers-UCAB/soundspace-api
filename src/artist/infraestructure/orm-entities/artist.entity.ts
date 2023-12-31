import { OrmArtistasTrendingEntity } from "../../../common/infraestructure/orm-entities/artist-trending.entity";
import { OrmCancionEntity } from "../../../song/infraestructure/orm-entities/song.entity";
import { PlaylistCreador } from "../../../common/infraestructure/orm-entities/playlist-creator.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('artista')
export class OrmArtistaEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_artista: string;

  @Column()
  nombre_artista: string;

  @Column()
  referencia_imagen: string;

  @ManyToMany(() => OrmCancionEntity, cancion => cancion.artistas)
  canciones: OrmCancionEntity[];

  @OneToMany(() => PlaylistCreador, playlistCreador => playlistCreador.artista)
  playlistCreadores: PlaylistCreador[];

  @OneToMany(() => OrmArtistasTrendingEntity, trending => trending.artista)
  trending: OrmArtistasTrendingEntity[];
}