import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Artist } from '../../domain/artist';
import { ArtistId } from '../../domain/value-objects/artist-id';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';
import { OrmArtistMapper } from '../mapper/orm-artist.mapper';
import { SongId } from 'src/song/domain/value-objects/song-id';

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
        .select([
          'artista.codigo_artista',
          'artista.nombre',
          'artista.referencia_imagen',
        ])
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

  findArtistBySongId(songId: SongId): Promise<Result<Artist>> {
    throw new Error('Method not implemented.');
  }

  async findTopArtists(): Promise<Result<Artist[]>> {
    throw new Error('Method not implemented.');
  }

  async findArtistsByName(name: string): Promise<Result<Artist[]>> {
    let response: Artist[];
    let error: any;
    try {
      const artists = await this.createQueryBuilder('artist')
        .where(' LOWER(artist.nombre_artista) LIKE :name', {
          name: `%${name.toLowerCase()}%`,
        })
        .select([
          'artist.nombre_artista',
          'artist.codigo_artista',
          'artist.referencia_imagen',
        ])
        .getMany();
        
      response = await Promise.all(
        artists.map(
          async (artist) => await this.OrmArtistMapper.toDomain(artist),
        ),
      );
    } catch (err) {
      error = err;
      console.log(error);
      
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
