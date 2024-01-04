import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { Album } from '../../domain/album';
import { Artist } from 'src/artist/domain/artist';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { OrmAlbumMapper } from '../mapper/orm-album.mapper';
import { AlbumId } from '../../domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
export class AlbumRepository
  extends Repository<OrmPlaylistEntity>
  implements IAlbumRepository
{
  private readonly OrmAlbumMapper: OrmAlbumMapper;
  constructor(dataSource: DataSource) {
    super(OrmPlaylistEntity, dataSource.createEntityManager());
    this.OrmAlbumMapper = new OrmAlbumMapper();
  }

  async findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    let response: Album[];
    let error: Error;
    console.log(' repo artistId: ', artistId);
    try {
      const albums = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .innerJoin(
          'cancion_artista',
          'ca',
          'ca.codigo_cancion = cancion.codigo_cancion',
        )
        .innerJoinAndSelect('ca.artista', 'artista')
        .where('artista.codigo_artista = :artistId', { artistId: artistId.Id })
        .where("playlist.tipo = 'album'")
        .getMany();
      console.log(' repo albums: ', albums);
      response = await Promise.all(
        albums.map(async (album) => await this.OrmAlbumMapper.toDomain(album)),
      );
      console.log(' repo response: ', response);
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
      return Result.success<Album[]>(response, 200);
    }
  }

  async findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    let response: Album;
    let error: Error;
    try {
      const album = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where("playlist.tipo = 'album'")
        .where('playlist.codigo_playlist = :id', { id: albumId.Id })
        .getOne();

      response = await this.OrmAlbumMapper.toDomain(album);
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
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where('playlist.trending = :trending', { trending: true })
        .where("playlist.tipo = 'album'")
        .getMany();
      response = await Promise.all(
        albums.map(
          async (albums) => await this.OrmAlbumMapper.toDomain(albums),
        ),
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
      return Result.success<Album[]>(response, 200);
    }
  }

  async findAlbumsByName(name: string, limit?: number, offset?: number): Promise<Result<Album[]>> {
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
          tipo: 'album',
        })    
        .limit(limit)
        .offset(offset)
        .getMany();
        
        response = await Promise.all(
          albums.map(
            async (album) => await this.OrmAlbumMapper.toDomain(album),
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
      return Result.success(response, 200);
    }
  }
}
