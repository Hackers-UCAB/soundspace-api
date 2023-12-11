import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { OrmReproduccionPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist-stream.entity';
//   import { HistorialEdicion } from './historial_edicion.entity';
  import { ReproduccionCancion } from '../../../common/infraestructure/orm-entities/song-streamed.entity';
import { OrmSubscripcionEntity } from 'src/subscription/infraestructure/orm-entities/subscription.entity';
  
  export enum genderOptions {
    Male = 'Male',
    Female = 'Female',
    Polygender = 'Polygender',
    Nonbinary = 'Nonbinary',
    Agender = 'Agender',
    Genderfluid = 'Genderfluid',
    Other = 'Other',
    Nodisplay = 'Nodisplay'
  }

  export enum UserRole {
    USER = 'USER',
    GUEST = 'GUEST',
  }
  
  @Entity('user')
  export class OrmUserEntity {
    @PrimaryGeneratedColumn('uuid')
    codigo_usuario: string;
  
    @Column({ nullable: true })
    nombre?: string;
  
    @Column({ nullable: true })
    correo?: string;
  
    @Column({ type: 'date', nullable: true })
    fecha_nac?: Date;
  
    @Column({ nullable: true })
    genero?: string;
    
    @Column({ unique: true })
    telefono: string;

    @Column('text', {
      default: 'GUEST'
    })
    rol: string;
  
    @OneToMany(() =>
      OrmReproduccionPlaylistEntity,
      (reproduccion) => reproduccion.usuario)
    reproducciones: OrmReproduccionPlaylistEntity[];
  
    // // @OneToMany(
    // //   () => HistorialEdicion,
    // //   (historialEdicion) => historialEdicion.usuario,
    // // )
    // // historialEdiciones: HistorialEdicion[];
  
    @OneToMany(
      () => ReproduccionCancion,
      (reproduccionCancion) => reproduccionCancion.usuario,
    )
    reproduccionesCanciones: ReproduccionCancion[];

    @OneToOne(() => OrmSubscripcionEntity, (subscripcion) => subscripcion.usuario)
    subscripcion: OrmSubscripcionEntity;
  }
  