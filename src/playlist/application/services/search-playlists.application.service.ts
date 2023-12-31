import { Result } from 'src/common/application/result-handler/result';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Playlist } from 'src/playlist/domain/playlist';
import { IPlaylistRepository } from 'src/playlist/domain/repositories/playlist.repository.interface';

export class SearchPlaylistsApplicationService
  implements
    IApplicationService<
      SearchItemsEntryApplicationDto,
      SearchItemsResponseApplicationDto
    >
{
  private readonly playlistRepository: IPlaylistRepository;

  constructor(playlistRepository: IPlaylistRepository) {
    this.playlistRepository = playlistRepository;
  }
  async execute(
    param: SearchItemsEntryApplicationDto,
  ): Promise<Result<SearchItemsResponseApplicationDto>> {
    const playlistsResult: Result<Playlist[]> =
      await this.playlistRepository.findPlaylistsByName(param.name);

    if (!playlistsResult.IsSuccess) {
      return Result.fail(
        null,
        playlistsResult.statusCode,
        playlistsResult.message,
        playlistsResult.error,
      );
    }
    const response: SearchItemsResponseApplicationDto = {
      userId: param.userId,
      data: playlistsResult.Data.map((playlist) => ({
        id: playlist.Id.Id,
        name: playlist.Name.Name,
      })),
    };

    return Result.success(response, 200);
  }
}
