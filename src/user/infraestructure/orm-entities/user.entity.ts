import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrmReproduccionPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist-stream.entity';
import { OrmReproduccionCancionEntity } from '../../../common/infraestructure/orm-entities/song-streamed.entity';
import { OrmSubscripcionEntity } from 'src/subscription/infraestructure/orm-entities/subscription.entity';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';

export enum genderOptions {
  Male = 'Male',
  Female = 'Female',
  Polygender = 'Polygender',
  Nonbinary = 'Nonbinary',
  Agender = 'Agender',
  Genderfluid = 'Genderfluid',
  Other = 'Other',
  Nodisplay = 'Nodisplay',
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

  @Column('text', {
    default: 'GUEST',
  })
  rol: string;

  @Column('text', {
    default: '123456',
  })
  token: string;

  @OneToMany(
    () => OrmReproduccionPlaylistEntity,
    (reproduccion) => reproduccion.usuario,
  )
  reproducciones: OrmReproduccionPlaylistEntity[];

  // // @OneToMany(
  // //   () => HistorialEdicion,
  // //   (historialEdicion) => historialEdicion.usuario,
  // // )
  // // historialEdiciones: HistorialEdicion[];

  @OneToMany(
    () => OrmReproduccionCancionEntity,
    (reproduccionCancion) => reproduccionCancion.usuario,
  )
  reproduccionesCanciones: OrmReproduccionCancionEntity[];

  @OneToOne(() => OrmSubscripcionEntity, (subscripcion) => subscripcion.usuario)
  subscripcion: OrmSubscripcionEntity;

  static create(
    userId: string,
    role: string,
    token: string,
    name?: string,
    email?: string,
    birthdate?: Date,
    gender?: UserGenderEnum,
  ): OrmUserEntity {
    const user = new OrmUserEntity();
    user.codigo_usuario = userId;
    user.rol = role;
    user.token = token;
    // user.rol = role;
    // user.token = token;
    // user.genero = gender;
    // user.correo = email;
    // user.fecha_nac = birthdate;
    // user.nombre = name;
    // return user;
    if (name) user.nombre = name;
    if (email) user.correo = email;
    if (birthdate) user.fecha_nac = birthdate;
    if (gender) user.genero = gender;
    return user;
  }
}
