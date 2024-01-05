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
  private readonly getBufferImage: IGetBufferImageInterface;
  songRepository: any;

  constructor(
    AlbumRepository: IAlbumRepository,
    getBufferImage: IGetBufferImageInterface,
  ) {
    this.AlbumRepository = AlbumRepository;
    this.getBufferImage = getBufferImage;
  }

  async execute(
    param: TopAlbumEntryApplicationDto,
  ): Promise<Result<GetTopAlbumResponseApplicationDto>> {
    console.log('aja service');
    const albumResult = await this.AlbumRepository.findTopAlbum();
    console.log('albumResult: ', albumResult);
    if (!albumResult.IsSuccess) {
      return Result.fail<GetTopAlbumResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }
    console.log('albumResult service', albumResult);
    const albums = [];
    for (let i = 0; i < albumResult.Data.length; i++) {
      const album = albumResult.Data[i];
      const imageResult = await this.getBufferImage.getFile(album.Cover.Path);
      /*
            if (!imageResult.IsSuccess) {
                return Result.fail(null, imageResult.statusCode, imageResult.message, imageResult.error);
            }
            */
      const albumObject = {
        id: album.Id.Id,
        image: imageResult.Data,
      };
      albums.push(albumObject);
    }
    const response: GetTopAlbumResponseApplicationDto = {
      userId: param.userId,
      albums: albums,
    };
    return Result.success<GetTopAlbumResponseApplicationDto>(
      response,
      albumResult.statusCode,
    );
  }
}
