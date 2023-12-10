import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Cancion } from '../../../song/infraestructure/orm-entities/song.entity';

@Entity('genero')
export class Genero {

  @PrimaryGeneratedColumn('uuid')
  codigo_genero: string;

  @Column()
  nombre_genero: string;

  @ManyToMany(() => Cancion, cancion => cancion.generos)
  canciones: Cancion[];
}
