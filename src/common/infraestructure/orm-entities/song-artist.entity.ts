import { OrmArtistaEntity } from "src/artist/infraestructure/orm-entities/artist.entity";
import { OrmCancionEntity } from "src/song/infraestructure/orm-entities/song.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('artista_cancion')
export class OrmArtistaCancionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: true
    })
    trending: boolean;

    @ManyToOne(() => OrmCancionEntity, (cancion) => cancion.codigo_cancion)
    cancion: OrmCancionEntity;

    @ManyToOne(() => OrmArtistaEntity, (artista) => artista.codigo_artista)
    artista: OrmArtistaEntity;
}