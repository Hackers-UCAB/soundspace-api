import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IPlaylistRepository } from '../../domain/repositories/playlist.repository.interface';
import { TopPlaylistEntryApplicationDto } from '../dto/entrys/get-top-playlist-entry.application.dto';
import { GetTopPlaylistResponseApplicationDto } from '../dto/responses/get-top-playlist-response.application.dto';

export class GetTopPlaylistService
  implements
    IApplicationService<
      TopPlaylistEntryApplicationDto,
      GetTopPlaylistResponseApplicationDto
    >
{
  private readonly playlistRepository: IPlaylistRepository;

  constructor(
    PlaylistRepository: IPlaylistRepository,
  ) {
      this.playlistRepository = PlaylistRepository;
  }

  async execute(
    param: TopPlaylistEntryApplicationDto,
  ): Promise<Result<GetTopPlaylistResponseApplicationDto>> {
      const playlistResult = await this.playlistRepository.findTopPlaylist();
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
