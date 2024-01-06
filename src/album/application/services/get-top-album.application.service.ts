import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IGetBufferImageInterface } from '../../../common/domain/interfaces/get-buffer-image.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { AlbumId } from '../../domain/value-objects/album-id';
import { GetAlbumByIdEntryApplicationDto } from '../dto/entries/get-album-by-id-entry.application.dto';
import { TopAlbumEntryApplicationDto } from '../dto/entries/get-top-album-entry.application.dto';
import { GetAlbumByIdResponseApplicationDto } from '../dto/responses/get-album-by-id-response.application.dto';
import { GetTopAlbumResponseApplicationDto } from '../dto/responses/get-top-album-response.application.dto';

export class GetTopAlbumService
  implements
    IApplicationService<
      TopAlbumEntryApplicationDto,
      GetTopAlbumResponseApplicationDto
    >
{
  private readonly AlbumRepository: IAlbumRepository;

  songRepository: any;

  constructor(
    AlbumRepository: IAlbumRepository,
    getBufferImage: IGetBufferImageInterface,
  ) {
    this.AlbumRepository = AlbumRepository;
  }

  async execute(
    param: TopAlbumEntryApplicationDto,
  ): Promise<Result<GetTopAlbumResponseApplicationDto>> {
    //console.log('aja service');
    const albumResult = await this.AlbumRepository.findTopAlbum();
    //console.log('albumResult: ', albumResult);
    if (!albumResult.IsSuccess) {
      return Result.fail<GetTopAlbumResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }
    //console.log('albumResult service', albumResult);

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
