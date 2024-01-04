import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { OrmCancionEntity } from '../orm-entities/song.entity';
import {
  ISongRepository,
  PartialSong,
} from 'src/song/domain/repositories/song.repository.interface';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { Song } from 'src/song/domain/song';
import { OrmSongMapper } from '../mapper/orm-song.mapper';

export class SongRepository
  extends Repository<OrmCancionEntity>
  implements ISongRepository
{
  private readonly ormSongMapper: OrmSongMapper;
  constructor(dataSource: DataSource, ormSongMapper: OrmSongMapper) {
    super(OrmCancionEntity, dataSource.createEntityManager());
    this.ormSongMapper = ormSongMapper;
  }

  async findPartialSongById(id: string): Promise<Result<PartialSong>> {
    let error: any
    try{
      const song = await this.findOne(
      {
        where: {
          codigo_cancion: id
        },
        select: ['referencia_cancion','duracion']
      });
      return Result.success({name:song.referencia_cancion, duration:song.duracion}, 200)
    }catch(error){
      return Result.fail(null, 500, error.message, new Error(error.message))
    }
  }

  async findSongById(id: SongId): Promise<Result<Song>> {
    let response: Song;
    let error: Error;
    try {
      console.log('Repo id: ', id);
      const song = await this.createQueryBuilder('cancion')
        .select([
          'cancion.codigo_cancion',
          'cancion.nombre_cancion',
          'cancion.duracion',
          'cancion.referencia_cancion',
          'cancion.referencia_preview',
          'cancion.referencia_imagen',
          'genero.nombre_genero',
        ])
        .innerJoinAndSelect('cancion.generos', 'genero')
        .where('cancion.codigo_cancion = :id', { id: id.Id })
        .getOne();
      console.log('Repo song: ', song);
      response = await this.ormSongMapper.toDomain(song);
      console.log('Repo response: ', response);
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado, hable con el administrador',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }

  async findSongUrlById(id: string): Promise<Result<SongId>> {
    try {
      const song = await this.findOne({
        where: {
          codigo_cancion: id,
        },
        select: ['codigo_cancion'],
      });
      return Result.success(SongId.create(song.codigo_cancion), 200);
    } catch (error) {
      return Result.fail(
        null,
        500,
        error.message ||
          'Ha ocurrido un error inesperado, hable con el administrador',
        error,
      );
    }
  }

  async findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>> {
    let response: Song[];
    let error: any;
    try {
      const songs = await this.createQueryBuilder('song')
        .innerJoinAndSelect('song.generos', 'genero')
        .where(' LOWER(song.nombre_cancion) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .limit(limit)
        .offset(offset)
        .getMany();

      response = await Promise.all(
        songs.map((song) => this.ormSongMapper.toDomain(song)),
      );
    } catch (err) {
      error = err;
      console.log('Error: ', error);
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado buscando las canciones, hable con el administrador',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }
}
