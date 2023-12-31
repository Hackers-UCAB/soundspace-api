import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { Song } from 'src/song/domain/song';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';

export class SearchSongsApplicationService
  implements
    IApplicationService<
      SearchItemsEntryApplicationDto,
      SearchResponseApplicationDto
    >
{
  private readonly songRepository: ISongRepository;
  constructor(songRepository: ISongRepository) {
    this.songRepository = songRepository;
  }
 

  async execute(
    param: SearchItemsEntryApplicationDto,
  ): Promise<Result<SearchResponseApplicationDto>> {
   
    const songsResult: Result<Song[]> = await this.songRepository.findSongsByName(param.name);
    
    if (!songsResult.IsSuccess) {
      return Result.fail(
        null,
        songsResult.statusCode,
        songsResult.message,
        songsResult.error,
      );
    }
    const response: SearchResponseApplicationDto = {
      userId: param.userId,
      data: songsResult.Data.map((song) => ({
        id: song.Id.Id,
        name: song.Name.Name,
      })),
    };
    return Result.success(
      response,
      200,
    );
  }
}
