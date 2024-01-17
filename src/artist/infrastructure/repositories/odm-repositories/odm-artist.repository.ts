import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { Artist } from 'src/artist/domain/artist';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { OdmArtistEntity } from '../../persistence-entities/odm-entities/odm-artist.entity';
import { Model } from 'mongoose';

export class OdmArtistRepository implements IArtistRepository {
  private readonly odmArtistMapper: IMapper<Artist, OdmArtistEntity>;
  private readonly artistModel: Model<OdmArtistEntity>;

  constructor(
    odmArtistMapper: IMapper<Artist, OdmArtistEntity>,
    artistModel: Model<OdmArtistEntity>,
  ) {
    this.odmArtistMapper = odmArtistMapper;
    this.artistModel = artistModel;
  }

  async findArtistById(artistId: ArtistId): Promise<Result<Artist>> {
    let response: Artist;
    let error: any;
    try {
      const artist = await this.artistModel.aggregate([
        { $match: { codigo_artista: artistId.Id } },
        {
          $lookup: {
            from: 'genres', 
            localField: 'generoRef',
            foreignField: '_id',
            as: 'genero',
          },
        },
        { $unwind: '$genero' },
        {
          $project: {
            'genero.nombre_genero': 1,
            codigo_artista: 1,
            nombre_artista: 1,
            referencia_imagen: 1,
            trending: 1,
            canciones: 1,
            albums: 1,
            _id: 0,
          },
        },
      ]);
      artist[0].generoRef = [artist[0].genero.nombre_genero];
      response = await this.odmArtistMapper.toDomain(artist[0]);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo el artista, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe el artista solicitado',
          new Error('No existe el artista solicitado'),
        );
      }
      return Result.success<Artist>(response, 200);
    }
  }

  async findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: any;
    try {
      const artists = await this.artistModel.aggregate([
        {
          $match: {
            canciones: songId.Id,
          },
        },
        {
          $lookup: {
            from: 'genres', 
            localField: 'generoRef',
            foreignField: '_id',
            as: 'genero',
          },
        },
        {
          $unwind: '$genero',
        },
        {
          $project: {
            codigo_artista: 1,
            nombre_artista: 1,
            referencia_imagen: 1,
            canciones: 1,
            albums: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);
      response = await Promise.all(
        artists.map(async (artist) => {
          artist.generoRef = [artist.genero.nombre_genero];
          return await this.odmArtistMapper.toDomain(artist);
        }),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail<Artist[]>(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo los artistas, hable con el administrador',
          error,
        );
      }
      return Result.success<Artist[]>(response, 200);
    }
  }

  async findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {
    let response: Artist[] = [];
    let error: any;
    try {
      const artists = await this.artistModel.aggregate([
        {
          $match: {
            albums: albumId.Id,
          },
        },
        {
          $lookup: {
            from: 'genres', 
            localField: 'generoRef',
            foreignField: '_id',
            as: 'genero',
          },
        },
        {
          $unwind: '$genero',
        },
        {
          $project: {
            codigo_artista: 1,
            nombre_artista: 1,
            referencia_imagen: 1,
            canciones: 1,
            albums: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);
      response = await Promise.all(
        artists.map(async (artist) => {
          artist.generoRef = [artist.genero.nombre_genero];
          return await this.odmArtistMapper.toDomain(artist);
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
            'Ha ocurrido un error inesperado obteniendo los artistas, hable con el administrador',
          error,
        );
      }
      return Result.success<Artist[]>(response, 200);
    }
  }

  async findTrendingArtists(): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: any;
    try {
      const artists = await this.artistModel.aggregate([
        {
          $match: {
            trending: true,
          },
        },
        {
          $lookup: {
            from: 'genres', 
            localField: 'generoRef',
            foreignField: '_id',
            as: 'genero',
          },
        },
        {
          $unwind: '$genero',
        },
        {
          $project: {
            codigo_artista: 1,
            nombre_artista: 1,
            referencia_imagen: 1,
            canciones: 1,
            albums: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);

      response = await Promise.all(
        artists.map(async (artist) => {
          artist.generoRef = [artist.genero.nombre_genero];
          return await this.odmArtistMapper.toDomain(artist);
        }),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail<Artist[]>(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo los artistas, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail<Artist[]>(
          null,
          404,
          'No existen artistas',
          new Error('No existen artistas'),
        );
      }
      return Result.success<Artist[]>(response, 200);
    }
  }
  findArtistsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Artist[]>> {
    throw new Error('Method not implemented.');
  }
}
