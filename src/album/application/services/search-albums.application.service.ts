import { Album } from 'src/album/domain/album';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';

export class SearchAlbumsApplicationService
  implements
    IApplicationService<
      SearchItemsEntryApplicationDto,
      SearchItemsResponseApplicationDto
    > {
    private readonly albumRepository: IAlbumRepository;
    constructor(albumRepository: IAlbumRepository) {
        this.albumRepository = albumRepository;
    }
    async execute(param: SearchItemsEntryApplicationDto): Promise<Result<SearchItemsResponseApplicationDto>> {
        const albumsResult: Result<Album[]> = await this.albumRepository.findAlbumsByName(param.name, param.limit, param.offset);

        if (!albumsResult.IsSuccess) {
            return Result.fail(
                null,
                albumsResult.statusCode,
                albumsResult.message,
                albumsResult.error,
            );
        }
        const response: SearchItemsResponseApplicationDto = {
            userId: param.userId,
            data: albumsResult.Data.map((album) => ({
                id: album.Id.Id,
                name: album.Name.Name,
            })),
        };
        return Result.success(
            response,
            200,
        );
    }
}
