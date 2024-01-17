import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { PartialSong } from 'src/song/domain/parameter-object/partial-song.parameter.object';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { Song } from 'src/song/domain/song';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { OdmSongEntity } from '../../persistence-entities/odm-entities/odm-song.entity';
import { Model } from 'mongoose';

export class OdmSongRepository implements ISongRepository {
  private readonly odmSongMapper: IMapper<Song, OdmSongEntity>;
  private readonly songModel: Model<OdmSongEntity>;
  constructor(
    odmSongMapper: IMapper<Song, OdmSongEntity>,
    songModel: Model<OdmSongEntity>,
  ) {
    this.odmSongMapper = odmSongMapper;
    this.songModel = songModel;
  }

  async findSongById(id: SongId): Promise<Result<Song>> {
    let response: Song;
    let error: any;
    try {
      const cancion = await this.songModel.findOne({
        codigo_cancion: id.Id,
      }).populate('generosRef');

      let generos = [];
      cancion.generosRef.forEach((element) => {
        generos.push(element);
      });
      cancion.generosRef = generos;
      response = await this.odmSongMapper.toDomain(cancion);
    } catch (err) {
      error = err;
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

  findSongUrlById(id: string): Promise<Result<SongId>> {
    throw new Error('Method not implemented.');
  }

  async findTopSongs(): Promise<Result<Song[]>> {
    let response: Song[];
    let error: any;
    try {
      const songs = await this.songModel.aggregate([
        {
          $match: {
            trending: true,
          },
        },
        {
          $lookup: {
            from: 'genres', 
            localField: 'generosRef',
            foreignField: '_id',
            as: 'genero',
          },
        },
        {
          $project: {
            codigo_cancion: 1,
            nombre_cancion: 1,
            duracion: 1,
            referencia_cancion: 1,
            referencia_preview: 1,
            referencia_imagen: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);
      response = await Promise.all(
        songs.map(async (song) => {
          let generos = [];
          song.genero.forEach((genero) => {
            generos.push(genero.nombre_genero[0]);
          });
          song.generosRef = generos;
          return await this.odmSongMapper.toDomain(song);
        }),
      );
    } catch (err) {
      error = err;
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
      if (!response) {
        return Result.fail(
          null,
          404,
          'No se encontraron canciones trending',
          new Error('No se encontraron canciones trending'),
        );
      }
      return Result.success(response, 200);
    }
  }
  
  findSongsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Song[]>> {
    throw new Error('Method not implemented.');
  }
  
  findUrl(id: SongId): Promise<Result<PartialSong>> {
    throw new Error('Method not implemented.');
  }
  findPreview(id: SongId): Promise<Result<PartialSong>> {
    throw new Error('Method not implemented.');
  }
}
