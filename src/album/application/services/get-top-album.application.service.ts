import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { GetTopAlbumResponseApplicationDto } from '../dto/responses/get-top-album-response.application.dto';
import { Album } from 'src/album/domain/album';

export class GetTopAlbumService
  implements
    IApplicationService<ServiceEntry, GetTopAlbumResponseApplicationDto>
{
  private readonly albumRepository: IAlbumRepository;

  constructor(AlbumRepository: IAlbumRepository) {
    this.albumRepository = AlbumRepository;
  }

  async execute(
    param: ServiceEntry,
  ): Promise<Result<GetTopAlbumResponseApplicationDto>> {
    const albumResult: Result<Album[]> =
      await this.albumRepository.findTopAlbum();
    if (!albumResult.IsSuccess) {
      return Result.fail<GetTopAlbumResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }

    const response: GetTopAlbumResponseApplicationDto = {
      userId: param.userId,
      albums: albumResult.Data,
    };
    return Result.success<GetTopAlbumResponseApplicationDto>(
      response,
      albumResult.statusCode,
    );
  }
}
