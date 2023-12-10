import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { ReproduccionPlaylist } from '../../../common/infraestructure/orm-entities/playlist-stream.entity';
//   import { HistorialEdicion } from './historial_edicion.entity';
  import { ReproduccionCancion } from '../../../common/infraestructure/orm-entities/song-streamed.entity';
import { Subscripcion } from 'src/subscription/infraestructure/orm-entities/subscription.entity';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';
  
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
  
  @Entity('users')
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
      ReproduccionPlaylist,
      (reproduccion) => reproduccion.usuario)
    reproducciones: ReproduccionPlaylist[];
  
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

    @OneToOne(() => Subscripcion, (subscripcion) => subscripcion.usuario)
    subscripcion: Subscripcion;


    static create(
      userId: string,
      name: string,
      email: string,
      birthdate: Date,
      gender: UserGenderEnum,
      phoneNumber: string,
      role: string,
    ): OrmUserEntity {
        const user = new OrmUserEntity();
        user.codigo_usuario = userId;
        user.nombre = name;
        user.correo = email;
        user.fecha_nac = birthdate;
        user.genero = gender;
        user.telefono = phoneNumber;
        user.rol = role;
        return user
    }

  }
    

  