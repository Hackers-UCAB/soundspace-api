import { Result } from 'src/common/domain/result-handler/result';
import { PartialSong } from 'src/song/domain/parameter-object/partial-song.parameter.object';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { Song } from 'src/song/domain/song';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { SongName } from 'src/song/domain/value-objects/song-name';

export class SongRepositoryMock implements ISongRepository {
  private readonly songs: Song[] = [];

  async findSongById(id: SongId): Promise<Result<Song>> {
    let response: Song | undefined;
    let error: Error | undefined;
    try {
      response = this.songs.find((song) => song.Id.Id === id.Id);
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message || 'Error simulado obteniendo la canción',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe la canción solicitada',
          new Error('No existe la canción solicitada'),
        );
      }
      return Result.success<Song>(response, 200);
    }
  }

  findSongUrlById(id: string): Promise<Result<SongId>> {
    throw new Error('Method not implemented.');
  }

  async findTopSongs(): Promise<Result<Song[]>> {
    try {
      const songsCount = this.songs.length;
      if (songsCount === 0) {
        return Result.fail(
          null,
          404,
          'No se encontraron songs',
          new Error('No se encontraron songs'),
        );
      }
      const randomsongs: Song[] = [];
      const numberOfRandomsongs = Math.floor(Math.random() * songsCount) + 1;
      for (let i = 0; i < numberOfRandomsongs; i++) {
        const randomIndex = Math.floor(Math.random() * songsCount);
        randomsongs.push(this.songs[randomIndex]);
      }
      return Result.success(randomsongs, 200);
    } catch (error) {
      return Result.fail(
        null,
        500,
        error.message || 'Error simulado al obtener las songs top',
        error,
      );
    }
  }

  async findSongsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Song[]>> {
    const songs: Song[] = [];
    for (let i = 0; i < this.songs.length; i++) {
      const song = this.songs[i];
      if (song.Name.Name.includes(name)) {
        songs.push(song);
      }
    }

    if (songs.length > 0) {
      return Result.success(songs, 200);
    } else {
      return Result.fail(
        null,
        404,
        'No se encontraron canciones',
        new Error('No se encontraron canciones'),
      );
    }
  }
  findUrl(id: SongId): Promise<Result<PartialSong>> {
    throw new Error('Method not implemented.');
  }
  findPreview(id: SongId): Promise<Result<PartialSong>> {
    throw new Error('Method not implemented.');
  }

  save(song: Song): Result<string> {
    this.songs.push(song);
    return Result.success('Guardado correctamente', 200);
  }

  static create() {
    return new SongRepositoryMock();
  }
}
