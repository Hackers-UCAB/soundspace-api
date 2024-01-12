import { Playlist } from 'src/playlist/domain/playlist';
import { Result } from '../../../common/application/result-handler/result';
import { ServiceEntry } from '../../../common/application/services/dto/entry/service-entry.dto';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IPlaylistRepository } from '../../domain/repositories/playlist.repository.interface';
import { GetTopPlaylistResponseApplicationDto } from '../dto/responses/get-top-playlist-response.application.dto';

export class GetTopPlaylistService
  implements
    IApplicationService<ServiceEntry, GetTopPlaylistResponseApplicationDto>
{
  private readonly playlistRepository: IPlaylistRepository;

  constructor(PlaylistRepository: IPlaylistRepository) {
    this.playlistRepository = PlaylistRepository;
  }

  async execute(
    param: ServiceEntry,
  ): Promise<Result<GetTopPlaylistResponseApplicationDto>> {
    const playlistResult: Result<Playlist[]> =
      await this.playlistRepository.findTopPlaylist();
    if (!playlistResult.IsSuccess) {
      return Result.fail<GetTopPlaylistResponseApplicationDto>(
        null,
        playlistResult.statusCode,
        playlistResult.message,
        playlistResult.error,
      );
    }

    const response: GetTopPlaylistResponseApplicationDto = {
      userId: param.userId,
      playlists: playlistResult.Data,
    };

    return Result.success<GetTopPlaylistResponseApplicationDto>(
      response,
      playlistResult.statusCode,
    );
  }
}
