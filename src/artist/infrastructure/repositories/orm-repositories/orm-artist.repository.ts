import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/domain/result-handler/result';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Artist } from '../../../domain/artist';
import { ArtistId } from '../../../domain/value-objects/artist-id';
import { OrmArtistaEntity } from '../../persistence-entities/orm-entities/orm-artist.entity';
import { OrmArtistMapper } from '../../mapper/orm-mapper/orm-artist.mapper';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';

export class OrmArtistRepository
  extends Repository<OrmArtistaEntity>
  implements IArtistRepository
{
  private readonly ormArtistMapper: IMapper<Artist, OrmArtistaEntity>;

  constructor(
    dataSource: DataSource,
    ormArtistMapper: IMapper<Artist, OrmArtistaEntity>,
  ) {
    super(OrmArtistaEntity, dataSource.createEntityManager());
    this.ormArtistMapper = ormArtistMapper;
  }

  async findArtistById(artistId: ArtistId): Promise<Result<Artist>> {
    let response: Artist;
    let error: Error;

    try {
      const artist = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .leftJoinAndSelect('artista.canciones', 'cancion')
        .leftJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .leftJoinAndSelect('playlistCreador.playlist', 'playlist')
        .where('artista.codigo_artista = :id', { id: artistId.Id })
        .getOne();
      
      response = await this.ormArtistMapper.toDomain(artist);
    } catch (e) {
      error = e;
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

  // In this version of the findArtistsBySongId method, if an error occurs
  // during the database query or the mapping of the artists, a Result
  // with a status code of 500 is returned.
  // If no artists are found for the given song ID (i.e., artists.length is 0),
  // an empty list is returned with a status code of 200.
  // If the artists are found and mapped successfully, a Result with
  // a status code of 200 is returned.
  async findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {
    let response: Artist[] = [];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .leftJoinAndSelect('artista.canciones', 'cancion')
        .leftJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .leftJoinAndSelect('playlistCreador.playlist', 'playlist')
        .where('cancion.codigo_cancion = :id', { id: songId.Id })
        .getMany();

      if (artists.length > 0) {
        response = await Promise.all(
          artists.map(
            async (artist) => await this.ormArtistMapper.toDomain(artist),
          ),
        );
      }
    } catch (e) {
      error = e;
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

  async findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {
    let response: Artist[] = [];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .innerJoinAndSelect('artista.canciones', 'cancion')
        .innerJoinAndSelect('cancion.generos', 'generoCancion')
        .innerJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .innerJoinAndSelect('playlistCreador.playlist', 'playlist')
        .where('playlistCreador.playlistCodigoPlaylist = :id', {
          id: albumId.Id,
        })
        .getMany();

      if (artists.length > 0) {
        response = await Promise.all(
          artists.map(
            async (artist) => await this.ormArtistMapper.toDomain(artist),
          ),
        );
      }
    } catch (e) {
      error = e;
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
    let response: Artist[] = [];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .leftJoinAndSelect('artista.canciones', 'cancion')
        .leftJoinAndSelect('cancion.generos', 'generoCancion')
        .leftJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .leftJoinAndSelect('playlistCreador.playlist', 'playlist')
        .where('artista.trending = :trending', { trending: true })
        .getMany();

      if (artists.length > 0) {
        response = await Promise.all(
          artists.map(
            async (artist) => await this.ormArtistMapper.toDomain(artist),
          ),
        );
      }
    } catch (e) {
      error = e;
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

  async findArtistsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: any;
    try {
      const artists = await this.createQueryBuilder('artist')
        .leftJoinAndSelect('artist.genero', 'generoArtista')
        .where(' LOWER(artist.nombre_artista) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .limit(limit)
        .offset(offset)
        .getMany();

      response = await Promise.all(
        artists.map(
          async (artist) => await this.ormArtistMapper.toDomain(artist),
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
            'Ha ocurrido un error inesperado buscando los artistas, hable con el administrador',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }
}
