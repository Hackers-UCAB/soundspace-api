import { Album } from 'src/album/domain/album';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { Result } from 'src/common/domain/result-handler/result';

export class AlbumRepositoryMock implements IAlbumRepository {

  private albumMap: Map<Album, ArtistId> = new Map();
  private readonly albums: Album[] = [];

  findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    const album = this.albums.find((a) => a.Id.equals(albumId));
    if (album) {
      return Promise.resolve(Result.success(album, 200));
    } else {
      return Promise.resolve(
        Result.fail(
          null,
          404,
          'No se encontró el álbum solicitado',
          new Error('No se encontró el álbum solicitado'),
        ),
      );
    }
  }

  findTopAlbum(): Promise<Result<Album[]>> {
    throw new Error('Method not implemented.');
  }

  findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    
    const albums = Array.from(this.albumMap.entries())
        .filter(([album, artist]) => artist.equals(artistId))
        .map(([album, artist]) => album);

      return Promise.resolve(Result.success(albums, 200));

  }

  async findAlbumsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Album[]>> {
    const albums: Album[] = [];
    for (let i = 0; i < this.albums.length; i++) {
      const album = this.albums[i];
      if (album.Name.Name.includes(name)) {
        albums.push(album);
      }
    }

    if (albums.length > 0) {
      return Result.success(albums, 200);
    } else {
      return Result.fail(
        null,
        404,
        'No se encontraron albums',
        new Error('No se encontraron albums'),
      );
    }
  }

  save(album: Album): Result<string> {
    this.albums.push(album);
    return Result.success('Guardado correctamente', 200);
  }

  saveMap(album: Album, artistId: ArtistId) {
    this.albumMap.set(album, artistId);
  }

  static create() {
    return new AlbumRepositoryMock();
  }
}
