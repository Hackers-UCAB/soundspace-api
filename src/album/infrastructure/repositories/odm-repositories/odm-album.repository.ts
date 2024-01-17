import { Model } from 'mongoose';
import { Album } from 'src/album/domain/album';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { OdmArtistEntity } from 'src/artist/infrastructure/persistence-entities/odm-entities/odm-artist.entity';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { OdmPlaylistEntity } from 'src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity';

export class OdmAlbumRepository implements IAlbumRepository {
  private readonly odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>;
  private readonly albumModel: Model<OdmPlaylistEntity>;
  private readonly artistModel: Model<OdmArtistEntity>;

  constructor(
    odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>,
    albumModel: Model<OdmPlaylistEntity>,
    artistModel: Model<OdmArtistEntity>,
  ) {
    this.albumModel = albumModel;
    this.odmAlbumMapper = odmAlbumMapper;
    this.artistModel = artistModel;
  }

  async findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    let response: Album;
    let error: any;
    try {
      const album = await this.albumModel.aggregate([
        {
          $match: {
            codigo_playlist: albumId.Id,
            tipo: 'Album',
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
            codigo_playlist: 1,
            nombre: 1,
            referencia_imagen: 1,
            canciones: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);
      album[0].generoRef = [album[0].genero.nombre_genero];
      response = await this.odmAlbumMapper.toDomain(album[0]);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo el album, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe el album solicitado',
          new Error('No existe el album solicitado'),
        );
      }
      return Result.success<Album>(response, 200);
    }
  }

  async findTopAlbum(): Promise<Result<Album[]>> {
    let response: Album[];
    let error: any;
    try {
      const albums = await this.albumModel.aggregate([
        {
          $match: {
            tipo: 'Album',
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
            codigo_playlist: 1,
            nombre: 1,
            referencia_imagen: 1,
            canciones: 1,
            'genero.nombre_genero': '$genero.nombre_genero',
          },
        },
      ]);
      response = await Promise.all(
        albums.map(async (album) => {
          album.generoRef = [album.genero.nombre_genero];
          return await this.odmAlbumMapper.toDomain(album);
        }),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail<Album[]>(
          null,
          500,
          error.message ||
            'Ha ocurrido un error obteniendo la lista de álbumes, hable con el administrador',
          error,
        );
      }
      // Filtrar los elementos nulos del array 'response'
      response = response.filter((album) => album !== null);
      // Verificar si el array 'response' es nulo
      if (response === null || response.length === 0) {
        return Result.fail(
          null,
          404,
          'No se encontraron albums top',
          new Error('No se encontraron albums top'),
        );
      }
      return Result.success<Album[]>(response, 200);
    }
  }

  async findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    let error: any;
    let response: Album[] = [];
    try {
      const artist = await this.artistModel.findOne({
        codigo_artista: artistId.Id,
      });
      let albums = [];
      if (artist.albums.length > 0) {
        for (const album of artist.albums) {
          const albumInfo = await this.albumModel.aggregate([
            { $match: { codigo_playlist: album } },
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
                
                _id: 0,
                codigo_playlist: 1,
                nombre: 1,
                referencia_imagen: 1,
                tipo: 1,
                trending: 1,
                canciones: 1,
                genero: 1,
              },
            },
          ]);
          if (albumInfo[0]) {
            albums.push(albumInfo[0]);
          }
        }
        response = await Promise.all(
          albums.map(async (album) => {
            album.generoRef = [album.genero.nombre_genero];
            return await this.odmAlbumMapper.toDomain(album);
          }),
        );
      }
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error obteniendo la lista de álbumes por artista, hable con el administrador',
          error,
        );
      }
      // Filtrar los elementos nulos del array 'response'
      response = response.filter((album) => album !== null);

      return Result.success<Album[]>(response, 200);
    }
  }

  findAlbumsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Album[]>> {
    throw new Error('Method not implemented.');
  }
}
