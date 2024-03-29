import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrmSubscripcionEntity } from 'src/subscription/infrastructure/persistence-entities/orm-entities/orm-subscription.entity';
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
  codigo_usuario: string;A

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
    array: true,
    default: [],
  })
  tokens: string[];

  @OneToOne(() => OrmSubscripcionEntity, (subscripcion) => subscripcion.usuario)
  subscripcion: OrmSubscripcionEntity;

  static create(
    userId: string,
    role: string,
    name?: string,
    email?: string,
    birthdate?: Date,
    gender?: UserGenderEnum,
  ): OrmUserEntity {
    const user = new OrmUserEntity();
    user.codigo_usuario = userId;
    user.rol = role;
    if (name) user.nombre = name;
    if (email) user.correo = email;
    if (birthdate) user.fecha_nac = birthdate;
    if (gender) user.genero = gender;
    return user;
  }
}
