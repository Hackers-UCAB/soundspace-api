import { Model } from 'mongoose';
import { Album } from 'src/album/domain/album';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { OdmPlaylistEntity } from 'src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity';

export class OdmAlbumRepository implements IAlbumRepository {
  private readonly odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>;
  private readonly albumModel: Model<OdmPlaylistEntity>;
  constructor(
    odmAlbumMapper: IMapper<Album, OdmPlaylistEntity>,
    albumModel: Model<OdmPlaylistEntity>,
  ) {
    this.albumModel = albumModel;
    this.odmAlbumMapper = odmAlbumMapper;
  }
  findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    throw new Error('Method not implemented.');
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

  findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    throw new Error('Method not implemented.');
  }
  findAlbumsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Album[]>> {
    throw new Error('Method not implemented.');
  }
}
