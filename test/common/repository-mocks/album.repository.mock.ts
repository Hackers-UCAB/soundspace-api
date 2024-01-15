import { Result } from 'src/common/application/result-handler/result';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { Album } from 'src/album/domain/album';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { AlbumName } from 'src/album/domain/value-objects/album-name';
import { AlbumCover } from 'src/album/domain/value-objects/album-cover';
import { AlbumGenre } from 'src/album/domain/value-objects/album-genre';
import { AlbumSongs } from 'src/album/domain/value-objects/album-songs';
import { SongId } from 'src/song/domain/value-objects/song-id';
export class AlbumRepositoryMock implements IAlbumRepository {
  private readonly _albums: Album[] = [];

  // Getter para obtener los álbumes actuales
  get albums(): Album[] {
    return this._albums;
  }

  // Método para configurar los álbumes
  setAlbums(albums: Album[]): void {
    this._albums.length = 0; // Limpiar los álbumes actuales
    this._albums.push(...albums); // Agregar los nuevos álbumes
  }

  async findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
    const album = this.albums.find((a) => a.Id.equals(albumId));
    if (album) {
      return Result.success(album, 200);
    } else {
      return Result.fail(
        null,
        404,
        'Album no encontrado',
        new Error('Album no encontrado'),
      );
    }
  }

  /*async findAlbumById(id: AlbumId): Promise<Result<Album>> {
    // Simular un resultado exitoso con un objeto Album simulado
    const simulatedAlbum: Album = {
      id: AlbumId.create('5e97538a-77a6-43ae-92bc-70556b6cca99'),
      events: [
        {
          ocurredOn: new Date(),
          eventName: 'AlbumCreated',
          id: AlbumId.create('5e97538a-77a6-43ae-92bc-70556b6cca99'),
          name: AlbumName.create('Happier Than Ever'),
          cover: AlbumCover.create('billieeilish_happierthanever.jpg'),
          albumSongs: AlbumSongs.create([
            SongId.create('songId1'),
            SongId.create('songId2'),
          ]),
          genre: AlbumGenre.create('Música pop'),
        },
      ],
      name: AlbumName.create('Happier Than Ever'),
      cover: AlbumCover.create('billieeilish_happierthanever.jpg'),
      albumSongs: AlbumSongs.create([
        SongId.create('songId1'),
        SongId.create('songId2'),
      ]),
      genre: AlbumGenre.create('Música pop'),
    };

    // Devolver un resultado exitoso simulado con el objeto Album simulado
    return Result.success(simulatedAlbum, 200);
  }*/

  async findTopAlbum(): Promise<Result<Album[]>> {
    // Implementa lógica para obtener álbumes top en el mock si es necesario
    return Result.success([], 200);
  }

  async findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
    // Implementa lógica para obtener álbumes por artista en el mock si es necesario
    return Result.success([], 200);
  }

  async findAlbumsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Album[]>> {
    // Implementa lógica para obtener álbumes por nombre en el mock si es necesario
    return Result.success([], 200);
  }
}
