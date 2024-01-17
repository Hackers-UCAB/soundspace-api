import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/domain/result-handler/result';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { Album } from '../../../domain/album';
import { OrmPlaylistEntity } from '../../../../common/infrastructure/persistence-entities/orm-entities/orm-playlist.entity';
import { AlbumId } from '../../../domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
export class OrmAlbumRepository
  extends Repository<OrmPlaylistEntity>
  implements IAlbumRepository
{
  private readonly ormAlbumMapper: IMapper<Album, OrmPlaylistEntity>;
  constructor(dataSource: DataSource, ormAlbumMapper: IMapper<Album, OrmPlaylistEntity>) {
    super(OrmPlaylistEntity, dataSource.createEntityManager());
    this.ormAlbumMapper = ormAlbumMapper;
  }

  async findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    let response: Album[];
    let error: any;

    try {
      const albums = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
          'cancion.nombre_cancion',
          'genero.nombre_genero',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .innerJoinAndSelect('playlist.genero', 'genero')
        .innerJoin(
          'playlist.creadores',
          'creador',
          'creador.artistaCodigoArtista = :artistId',
          { artistId: artistId.Id },
        )
        .where("playlist.tipo = 'Album'")
        .getMany();

      response = await Promise.all(
        albums.map(async (album) => await this.ormAlbumMapper.toDomain(album)),
      );
    } catch (e) {
      error = e;
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

  async findAlbumById(id: AlbumId): Promise<Result<Album>> {
    let response: Album;
    let error: any;
    try {
      const album = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
          'cancion.nombre_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .innerJoinAndSelect('playlist.genero', 'genero')
        .where("playlist.codigo_playlist = :id and playlist.tipo = 'Album'", {
          id: id.Id,
        })
        .getOne();

      response = await this.ormAlbumMapper.toDomain(album);
    } catch (e) {
      error = e;
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
    let error: Error;
    try {
      const albums = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
          'genero.nombre_genero',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .innerJoinAndSelect(
          'genero',
          'genero',
          'playlist.generoCodigoGenero = genero.codigo_genero',
        )
        .where('playlist.trending = :trending', { trending: true })
        .andWhere("playlist.tipo = 'Album'")
        .getMany();

      response = await Promise.all(
        albums.map(async (album) => await this.ormAlbumMapper.toDomain(album)),
      );
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo la lista de albums top, hable con el administrador',
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

  async findAlbumsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Album[]>> {
    let response: Album[];
    let error: any;
    try {
      const albums = await this.createQueryBuilder('album')
        .leftJoinAndSelect('album.canciones', 'playlistCancion')
        .leftJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where(' LOWER(album.nombre) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .andWhere('album.tipo = :tipo', {
          tipo: 'Album',
        })
        .getMany();

      let finalAlbum: OrmPlaylistEntity[] = albums.slice(
        offset,
        offset + limit,
      );
      response = await Promise.all(
        finalAlbum.map(
          async (album) => await this.ormAlbumMapper.toDomain(album),
        ),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado buscando los albums, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No se encontró el album con el nombre solicitado',
          new Error('No se encontró el album con el nombre solicitado'),
        );
      }
      return Result.success(response, 200);
    }
  }
}
