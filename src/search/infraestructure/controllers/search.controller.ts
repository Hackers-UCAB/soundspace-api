import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { SearchResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SearchEntryApplicationDto } from 'src/search/application/dto/search.entry.application.dto';
import { QuerySearchDto } from '../dto/queary-search.dto';
import { Result } from 'src/common/application/result-handler/result';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';

@Controller('search')
export class SearchController {
  constructor(
    @Inject('SearchApplicationService')
    private readonly searchApplicationService: IApplicationService<
      SearchEntryApplicationDto,
      SearchResponseApplicationDto
    >,
  ) {}

  @Get(':term')
  @Auth()
  async search(
    @Param('term') term: string,
    @Query() querySearchDto: QuerySearchDto,
    @GetUser('id') userId: UserId,
  ): Promise<Result<SearchResponseApplicationDto>> {
    
    const dto: SearchEntryApplicationDto = {
      userId: userId.Id,
      type: querySearchDto.type,
      name: term,
    };
    const searchResult: Result<SearchResponseApplicationDto> =
      await this.searchApplicationService.execute(dto);
    
      if(!searchResult.IsSuccess){
        HttpResponseHandler.HandleException(
          searchResult.StatusCode,
          searchResult.message,
          searchResult.error
        );
      }
    return HttpResponseHandler.Success(200, searchResult.Data);
  }
}
