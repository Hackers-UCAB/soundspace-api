import { Result } from 'src/common/application/result-handler/result';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SearchEntryApplicationDto } from '../dto/entry/search.entry.application.dto';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchResponseApplicationDto } from '../dto/response/search.response.application.dto';

export class SearchApplicationService
  implements
    IApplicationService<
      SearchEntryApplicationDto,
      SearchResponseApplicationDto
    >
{
  private strategies: Record<
    string,
    IApplicationService<
      SearchItemsEntryApplicationDto,
      SearchItemsResponseApplicationDto
    >
  >;

  constructor(
    strategies: Record<
      string,
      IApplicationService<
        SearchItemsEntryApplicationDto,
        SearchItemsResponseApplicationDto
      >
    >,
  ) {
    this.strategies = strategies;
  }
  async execute(
    param: SearchEntryApplicationDto,
  ): Promise<Result<SearchResponseApplicationDto>> {
    const { types, ...searchParam } = param;
    const response: SearchResponseApplicationDto = {
      userId: searchParam.userId,
    };
    const limit: number = searchParam.limit / types.length;    
    const offset: number = limit * searchParam.offset;
    searchParam.limit = limit;
    searchParam.offset = offset;

    types.forEach(async (type) => {
      const searchResult: Result<SearchItemsResponseApplicationDto> =
        await this.strategies[type].execute(searchParam);
      if (!searchResult.IsSuccess) {
        return searchResult;
      }
      response[type] = searchResult.Data.data;
    });
    return Result.success(response, 200);
  }
}
