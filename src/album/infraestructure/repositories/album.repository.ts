import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IAlbumRepository } from 'src/Album/domain/repositories/Album.repository.interface';
import { Album } from '../../domain/album';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { OrmAlbumMapper } from '../mapper/orm-album.mapper';
import { AlbumId } from '../../domain/value-objects/album-id';
export class AlbumRepository
  extends Repository<OrmPlaylistEntity>
  implements IAlbumRepository
{
  private readonly OrmAlbumMapper: OrmAlbumMapper;
  constructor(dataSource: DataSource) {
    super(OrmPlaylistEntity, dataSource.createEntityManager());
    this.OrmAlbumMapper = new OrmAlbumMapper();
  }
  async findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    let response: Album;
    let error: Error;
      try {
          console.log("aja repo");
          console.log("aja repo");
          console.log("aja repo");
          console.log("aja repo");
          console.log("aja repo");

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
      console.log("aja repo");
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
        
        console.log("albums repo",albums);
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
            'Ha ocurrido un error inesperado obteniendo el album, hable con el administrador',
          error,
        );
      }
      return Result.success<Album[]>(response, 200);
    }
  }
}
