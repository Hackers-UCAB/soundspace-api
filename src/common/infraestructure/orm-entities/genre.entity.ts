import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { OrmCancionEntity } from '../../../song/infraestructure/orm-entities/song.entity';

@Entity('genero')
export class OrmGeneroEntity {

  @PrimaryGeneratedColumn('uuid')
  codigo_genero: string;

  @Column()
  nombre_genero: string;

  @ManyToMany(() => OrmCancionEntity, cancion => cancion.generos)
  canciones: OrmCancionEntity[];
}
