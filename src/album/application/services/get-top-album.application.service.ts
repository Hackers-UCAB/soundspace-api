import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { TopAlbumEntryApplicationDto } from '../dto/entries/get-top-album-entry.application.dto';
import { GetTopAlbumResponseApplicationDto } from '../dto/responses/get-top-album-response.application.dto';

export class GetTopAlbumService
  implements
    IApplicationService<
      TopAlbumEntryApplicationDto,
      GetTopAlbumResponseApplicationDto
    >
{
  private readonly albumRepository: IAlbumRepository;

  songRepository: any;

  constructor(AlbumRepository: IAlbumRepository) {
    this.albumRepository = AlbumRepository;
  }

  async execute(
    param: TopAlbumEntryApplicationDto,
  ): Promise<Result<GetTopAlbumResponseApplicationDto>> {
    const albumResult = await this.albumRepository.findTopAlbum();
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
