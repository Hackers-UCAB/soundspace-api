import { Artist } from 'src/artist/domain/artist';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { Result } from 'src/common/application/result-handler/result';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';

export class SearchArtistsApplicationService
  implements
    IApplicationService<
      SearchItemsEntryApplicationDto,
      SearchItemsResponseApplicationDto
    >
{
  private readonly artistRepository: IArtistRepository;
  constructor(artistRepository: IArtistRepository) {
    this.artistRepository = artistRepository;
  }
  async execute(
    param: SearchItemsEntryApplicationDto,
  ): Promise<Result<SearchItemsResponseApplicationDto>> {
    const aritstsResult: Result<Artist[]> = await this.artistRepository.findArtistsByName(param.name, param.limit, param.offset);
    
    if (!aritstsResult.IsSuccess) {
      return Result.fail(
        null,
        aritstsResult.statusCode,
        aritstsResult.message,
        aritstsResult.error,
      );
    }
    const response: SearchItemsResponseApplicationDto = {
      userId: param.userId,
      data: aritstsResult.Data.map((artist) => ({
        id: artist.Id.Id,
        name: artist.Name.Name,
      })),
    };
    return Result.success(
      response,
      200,
    );
  }
}
