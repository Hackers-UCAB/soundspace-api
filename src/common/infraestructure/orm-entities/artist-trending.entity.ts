import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';

@Entity('artistas_trending')
export class OrmArtistasTrendingEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_trending: string;

  @Column()
  fecha: Date;

  @ManyToOne(() => OrmArtistaEntity, artista => artista.trending)
  artista: OrmArtistaEntity;
}
