import { SearchAlbumsApplicationService } from 'src/album/application/services/search-albums.application.service';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { Result } from 'src/common/application/result-handler/result';
import { SearchResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SearchSongsApplicationService } from 'src/song/application/services/search-songs.application.service';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SearchEntryApplicationDto } from '../dto/search.entry.application.dto';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';

export class SearchApplicationService
  implements
    IApplicationService<
      SearchEntryApplicationDto,
      SearchResponseApplicationDto
    >
{
  private strategies: Record<string, IApplicationService<SearchItemsEntryApplicationDto, SearchResponseApplicationDto>>

  constructor(songRepository: ISongRepository, albumRepository: IAlbumRepository){
    this.strategies = {
      'song': new SearchSongsApplicationService(songRepository),
      'album': new SearchAlbumsApplicationService(albumRepository),
    }
  }
  async execute(
    param: SearchEntryApplicationDto,
  ): Promise<Result<SearchResponseApplicationDto>> {    
    const {type, ...searchParam} = param;
    const searchResult: Result<SearchResponseApplicationDto>= await this.strategies[type].execute(searchParam);
    return searchResult;
  }
}
