import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SearchEntryApplicationDto } from 'src/search/application/dto/entry/search.entry.application.dto';
import { QuerySearchDto } from '../dto/queary-search.dto';
import { Result } from 'src/common/application/result-handler/result';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { SearchResponseApplicationDto } from 'src/search/application/dto/response/search.response.application.dto';

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
  ){
    //TODO: Agregarle paginacion, limit y offset
    const dto: SearchEntryApplicationDto = {
      userId: userId.Id,
      types: querySearchDto.type ? [querySearchDto.type] : ['artist', 'album', 'playlist', 'song'],
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
    const {userId: ignore, ...response} = searchResult.Data
    return HttpResponseHandler.Success(200, response);
  }
}
