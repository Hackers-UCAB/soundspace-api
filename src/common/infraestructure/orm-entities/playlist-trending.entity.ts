import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrmPlaylistEntity } from './playlist.entity';

@Entity('playlist_trending')
<<<<<<< HEAD
export class OrmPlaylistTrendingEntity {
=======
export class OrmPlaylistTrendingTrending {
>>>>>>> 615d3d03d555ba60472a01b06e62835b2283f25e
  @PrimaryGeneratedColumn('uuid')
  codigo_trending: string;

  @Column()
  fecha: Date;

  @ManyToOne(() => OrmPlaylistEntity, playlist => playlist.trending)
  playlist: OrmPlaylistEntity;
}
