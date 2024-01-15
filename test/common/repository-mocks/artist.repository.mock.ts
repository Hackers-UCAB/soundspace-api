import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Artist } from 'src/artist/domain/artist';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { OrmArtistaEntity } from 'src/artist/infraestructure/orm-entities/artist.entity';
import { OrmArtistMapper } from 'src/artist/infraestructure/mapper/orm-artist.mapper';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
export class ArtistRepositoryMock implements IArtistRepository {
  private readonly artists: Artist[] = [];

  async saveAggregate(artist: Artist): Promise<Result<string>> {
    this.artists.push(artist);
    return Result.success('Artista guardado correctamente', 200);
  }

  async findArtistById(artistId: ArtistId): Promise<Result<Artist>> {
    const artist = this.artists.find((a) => a.Id.equals(artistId));
    if (artist) {
      return Result.success(artist, 200);
    } else {
      return Result.fail(
        null,
        404,
        'Artista no encontrado',
        new Error('Artista no encontrado'),
      );
    }
  }

  async findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {
    /*
    const artists = this.artists.filter((artist) =>
      artist.Songs.Id.some((id) => id.equals(songId)),
    );*/
    return Result.success([], 200);
  }

  async findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {
    /*
    const artists = this.artists.filter((artist) =>
      artist.Albums.Id.some((id) => id.equals(albumId)),
    );*/

    return Result.success([], 200);
  }

  async findTrendingArtists(): Promise<Result<Artist[]>> {
    //const trendingArtists = this.artists.filter((artist) => artist.Trending);

    return Result.success([], 200);
  }

  async findArtistsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Artist[]>> {
    const filteredArtists = this.artists
      .filter((artist) =>
        artist.Name.Name.toLowerCase().includes(name.toLowerCase()),
      )
      .slice(offset, offset + limit);
    return Result.success(filteredArtists, 200);
  }
}
