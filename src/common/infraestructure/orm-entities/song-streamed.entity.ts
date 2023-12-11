import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { OrmUserEntity } from '../../../user/infraestructure/orm-entities/user.entity';
import { OrmCancionEntity } from '../../../song/infraestructure/orm-entities/song.entity';

//TODO: Cambiar el nombre del file

@Entity('reproduccion_cancion')
export class ReproduccionCancion {

  @PrimaryGeneratedColumn('uuid')
  codigo_reproduccion: string;

  // @PrimaryColumn()
  // codigo_usuario: string;

  // @PrimaryColumn()
  // codigo_cancion: string;

  @ManyToOne(() => OrmUserEntity, user => user.reproduccionesCanciones)
  // @JoinColumn({ name: 'codigo_usuario' })
  usuario: OrmUserEntity;

  @ManyToOne(() => OrmCancionEntity, cancion => cancion.reproduccionesCanciones)
  // @JoinColumn({ name: 'codigo_cancion' })
  cancion: OrmCancionEntity;

  @Column({ type: 'timestamp' })
  fecha_reproduccion: Date;

}
