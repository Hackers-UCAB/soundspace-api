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
    try {
      const albums = await this.createQueryBuilder('playlist')
        .distinct(true)
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
        ])
        .innerJoin(
          'playlist_cancion',
          'pc',
          'playlist.codigo_playlist = pc."playlistCodigoPlaylist"',
        )
        .innerJoin(
          'cancion_artista',
          'ca',
          'pc."cancionCodigoCancion" = ca.codigo_cancion',
        )
        .innerJoin('artista', 'a', 'ca.codigo_artista = a.codigo_artista')
        .where('playlist.tipo = :albumType', { albumType: 'album' })
        .andWhere('a.codigo_artista = :artistId', { artistId: artistId.Id })
        .getMany();

      console.log('albums repo', albums);

      response = await Promise.all(
        albums.map(async (album) => await this.OrmAlbumMapper.toDomain(album)),
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
      return Result.success<Album[]>(response, 200);
    }
  }

  async findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    let response: Album;
    let error: Error;
    try {
      console.log('aja repo');
      console.log('aja repo');
      console.log('aja repo');
      console.log('aja repo');
      console.log('aja repo');

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
      console.log('aja repo');
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

      console.log('albums repo', albums);
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
}
