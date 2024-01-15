import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { Song } from 'src/song/domain/song';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { SongUrl } from 'src/song/domain/value-objects/song-url';
import { SongDuration } from 'src/song/domain/value-objects/song-duration';
import { PartialSong } from 'src/song/domain/parameter-object/partial-song.parameter.object';

export class SongRepositoryMock implements ISongRepository {
  private readonly songs: Song[] = [];

  async saveAggregate(song: Song): Promise<Result<string>> {
    this.songs.push(song);
    return Result.success('Canción guardada correctamente', 200);
  }

  async findSongById(id: SongId): Promise<Result<Song>> {
    const song = this.songs.find((s) => s.Id.equals(id));
    if (song) {
      return Result.success(song, 200);
    } else {
      return Result.fail(
        null,
        404,
        'Canción no encontrada',
        new Error('Canción no encontrada'),
      );
    }
  }

  async findSongUrlById(id: string): Promise<Result<SongId>> {
    try {
      const song = this.songs.find((s) => s.Id.Id === id);
      if (song) {
        return Result.success(SongId.create(id), 200);
      } else {
        return Result.fail(
          null,
          404,
          'Canción no encontrada',
          new Error('Canción no encontrada'),
        );
      }
    } catch (error) {
      return Result.fail(
        null,
        500,
        'Ha ocurrido un error inesperado, hable con el administrador',
        error,
      );
    }
  }

  async findSongsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Song[]>> {
    return Result.success([], 200);
  }

  async findTopSongs(): Promise<Result<Song[]>> {
    //const topSongs = this.songs.filter((song) => song.Trending);
    return Result.success([], 200);
  }

  async findUrl(id: SongId): Promise<Result<PartialSong>> {
    // Simula una canción con referencia_cancion y duracion
    const simulatedSong = {
      referencia_cancion: 'simulated_song_url',
      duracion: 300, // Duración simulada en segundos
    };

    // Devuelve un resultado exitoso simulado con la canción simulada
    return Result.success(
      {
        name: SongUrl.create(simulatedSong.referencia_cancion),
        duration: SongDuration.create(simulatedSong.duracion),
      },
      200,
    );
  }

  async findPreview(id: SongId): Promise<Result<PartialSong>> {
    // Simula una canción con referencia_preview y duracion
    const simulatedSong = {
      referencia_preview: 'simulated_preview_url',
      duracion: 300, // Duración simulada en segundos
    };

    // Devuelve un resultado exitoso simulado con la canción simulada
    return Result.success(
      {
        name: SongUrl.create(simulatedSong.referencia_preview),
        duration: SongDuration.create(simulatedSong.duracion),
      },
      200,
    );
  }
}
