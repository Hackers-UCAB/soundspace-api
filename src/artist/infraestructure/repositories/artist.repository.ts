import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Artist } from '../../domain/artist';
import { ArtistId } from '../../domain/value-objects/artist-id';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';
import { OrmArtistMapper } from '../mapper/orm-artist.mapper';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { AlbumId } from 'src/album/domain/value-objects/album-id';

export class ArtistRepository
  extends Repository<OrmArtistaEntity>
  implements IArtistRepository
{
  private readonly OrmArtistMapper: OrmArtistMapper;

  constructor(dataSource: DataSource) {
    super(OrmArtistaEntity, dataSource.createEntityManager());
    this.OrmArtistMapper = new OrmArtistMapper();
  }

  async findArtistById(artistId: ArtistId): Promise<Result<Artist>> {
    let response: Artist;
    let error: Error;

    try {
      const artist = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.canciones', 'cancion')
        .innerJoinAndSelect('cancion.generos', 'generoCancion')
        .innerJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .innerJoinAndSelect('playlistCreador.playlist', 'playlist')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .where('artista.codigo_artista = :id', { id: artistId.Id })
        .getOne();

      response = await this.OrmArtistMapper.toDomain(artist);
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
      return Result.success<Artist>(response, 200);
    }
  }

  async findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.canciones', 'cancion')
        .innerJoinAndSelect('cancion.generos', 'generoCancion')
        .innerJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .innerJoinAndSelect('playlistCreador.playlist', 'playlist')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .where('cancion.codigo_cancion = :id', { id: songId.Id })
        .getMany();

      response = await Promise.all(
        artists.map(
          async (artist) => await this.OrmArtistMapper.toDomain(artist),
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
            'Ha ocurrido un error inesperado obteniendo el artista, hable con el administrador',
          error,
        );
      }
      return Result.success<Artist[]>(response, 200);
    }
  }

  async findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.canciones', 'cancion')
        .innerJoinAndSelect('cancion.generos', 'generoCancion')
        .innerJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .innerJoinAndSelect('playlistCreador.playlist', 'playlist')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .where('playlistCreador.playlistCodigoPlaylist = :id', {
          id: albumId.Id,
        })
        .getMany();

      response = await Promise.all(
        artists.map(
          async (artist) => await this.OrmArtistMapper.toDomain(artist),
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
            'Ha ocurrido un error inesperado obteniendo el artista, hable con el administrador',
          error,
        );
      }
      return Result.success<Artist[]>(response, 200);
    }
  }

  async findTrendingArtists(): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: Error;

    try {
      const artists = await this.createQueryBuilder('artista')
        .innerJoinAndSelect('artista.canciones', 'cancion')
        .innerJoinAndSelect('cancion.generos', 'generoCancion')
        .innerJoinAndSelect('artista.playlistCreadores', 'playlistCreador')
        .innerJoinAndSelect('playlistCreador.playlist', 'playlist')
        .innerJoinAndSelect('artista.genero', 'generoArtista')
        .where('artista.trending = :trending', { trending: true })
        .getMany();

      response = await Promise.all(
        artists.map(
          async (artist) => await this.OrmArtistMapper.toDomain(artist),
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
            'Ha ocurrido un error inesperado obteniendo el artista, hable con el administrador',
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
        .leftJoinAndSelect('artist.canciones', 'cancion')
        .leftJoinAndSelect('artist.genero', 'generoArtista')
        .where(' LOWER(artist.nombre_artista) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .getMany();

      let finalArtists: OrmArtistaEntity[] = artists.slice(
        offset,
        offset + limit,
      );
      
      response = await Promise.all(
        finalArtists.map(
          async (artist) => await this.OrmArtistMapper.toDomain(artist),
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
