import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';


@Entity('publicidad')
export class OrmPublicidadEntity {
  @PrimaryGeneratedColumn('uuid')
  codigo_publicidad: string;

  @Column()
  url_publicidad: string;

  @Column()
  referencia_imagen: string;

}
