import { ArtistasTrending } from "../../../common/infraestructure/orm-entities/artist-trending.entity";
import { Cancion } from "../../../song/infraestructure/orm-entities/song.entity";
import { PlaylistCreador } from "../../../common/infraestructure/orm-entities/playlist-creator.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('artista')
export class Artista {
  @PrimaryGeneratedColumn('uuid')
  codigo_artista: string;

  @Column()
  nombre_artista: string;

  @Column()
  referencia_imagen: string;

  @ManyToMany(() => Cancion, cancion => cancion.artistas)
  canciones: Cancion[];

  @OneToMany(() => PlaylistCreador, playlistCreador => playlistCreador.artista)
  playlistCreadores: PlaylistCreador[];

  @OneToMany(() => ArtistasTrending, trending => trending.artista)
  trending: ArtistasTrending[];
}