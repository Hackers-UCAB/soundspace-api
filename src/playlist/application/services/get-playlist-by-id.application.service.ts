import { Song } from 'src/song/domain/song';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { ISongRepository } from '../../../song/domain/repositories/song.repository.interface';
import { IPlaylistRepository } from '../../domain/repositories/playlist.repository.interface';
import { PlaylistId } from '../../domain/value-objects/playlist-id';
import { GetPlaylistByIdEntryApplicationDto } from '../dto/entrys/get-playlist-by-id-entry.application.dto';
import { GetPlaylistByIdResponseApplicationDto } from '../dto/responses/get-playlist-by-id-response.application.dto';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Artist } from 'src/artist/domain/artist';

export class GetPlaylistByIdService
  implements
    IApplicationService<
      GetPlaylistByIdEntryApplicationDto,
      GetPlaylistByIdResponseApplicationDto
    >
{
  private readonly playlistRepository: IPlaylistRepository;
  private readonly songRepository: ISongRepository;
  private readonly artistRepository: IArtistRepository;

  constructor(
    playlistRepository: IPlaylistRepository,
    songRepository: ISongRepository,
    artistRepository: IArtistRepository,
  ) {
    this.playlistRepository = playlistRepository;
    this.songRepository = songRepository;
    this.artistRepository = artistRepository;
  }

  async execute(
    param: GetPlaylistByIdEntryApplicationDto,
  ): Promise<Result<GetPlaylistByIdResponseApplicationDto>> {
    //Primero se crea el id del playlist
    const playlistId = PlaylistId.create(param.playlistId);
    //Buscamos el playlist en el repo
    const playlistResult =
      await this.playlistRepository.findPlaylistById(playlistId);

    if (!playlistResult.IsSuccess) {
      return Result.fail<GetPlaylistByIdResponseApplicationDto>(
        null,
        playlistResult.statusCode,
        playlistResult.message,
        playlistResult.error,
      );
    }
    let songs: {
      song: Song;
      artists: Artist[];
    }[] = [];
    //buscamos todas las canciones relacionadas a ese playlist para crear el arreglo de Song []
    for (const songId of playlistResult.data.PlaylistSongs.Songs) {
      const searchedSong: Result<Song> =
        await this.songRepository.findSongById(songId);

      if (!searchedSong.IsSuccess) {
        return Result.fail<GetPlaylistByIdResponseApplicationDto>(
          null,
          searchedSong.statusCode,
          searchedSong.message,
          searchedSong.error,
        );
      }
      const artist: Result<Artist[]> =
        await this.artistRepository.findArtistsBySongId(songId);

      if (!artist.IsSuccess) {
        return Result.fail<GetPlaylistByIdResponseApplicationDto>(
          null,
          artist.statusCode,
          artist.message,
          artist.error,
        );
      }
      songs.push({
        song: searchedSong.Data,
        artists: artist.Data,
      });
    }

    const playlistResponseDto: GetPlaylistByIdResponseApplicationDto = {
      userId: param.userId,
      playlist: playlistResult.Data,
      songs: songs,
    };

    return Result.success(playlistResponseDto, 200);
  }
}
