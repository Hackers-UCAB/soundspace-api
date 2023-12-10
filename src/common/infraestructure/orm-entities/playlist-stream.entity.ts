import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { OrmUserEntity } from '../../../user/infraestructure/orm-entities/user.entity';
  import { Playlist } from './playlist.entity';
  
  //TODO: Cambiar nombre del file

  @Entity('reproduccion_playlist')
  export class ReproduccionPlaylist {
    @PrimaryGeneratedColumn('uuid')
    codigo_reproduccion: string;
  
    // @PrimaryColumn()
    // usuarioId: number;
  
    // @PrimaryColumn()
    // playlistId: number;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_reproduccion: Date;
  
    @ManyToOne(() => OrmUserEntity, (usuario) => usuario.reproducciones)
    // @JoinColumn({ name: 'usuarioId' })
    usuario: OrmUserEntity;
  
    @ManyToOne(() => Playlist, (playlist) => playlist.reproducciones)
    // @JoinColumn({ name: 'playlistId' })
    playlist: Playlist;
  }
  