import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { GetAlbumsByArtistEntryApplicationDto } from '../dto/entries/get-albums-by-artist-entry.application.dto';
import { GetAlbumsByArtistResponseApplicationDto } from '../dto/responses/get-albums-by-artist-response.application.dto';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class GetAlbumsByArtistService
  implements
    IApplicationService<
      GetAlbumsByArtistEntryApplicationDto,
      GetAlbumsByArtistResponseApplicationDto
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
    param: GetAlbumsByArtistEntryApplicationDto,
  ): Promise<Result<GetAlbumsByArtistResponseApplicationDto>> {
    //console.log('aja service');
    const artistId = ArtistId.create(param.artistId);
    const albumResult = await this.AlbumRepository.findAlbumsByArtist(artistId);
    console.log('albumResult: ', albumResult);
    if (!albumResult.IsSuccess) {
      return Result.fail<GetAlbumsByArtistResponseApplicationDto>(
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
      const albumObject = {
        id: album.Id.Id,
        image: imageResult.Data,
      };
      albums.push(albumObject);
    }
    const response: GetAlbumsByArtistResponseApplicationDto = {
      userId: param.userId,
      albums: albums,
    };
    return Result.success<GetAlbumsByArtistResponseApplicationDto>(
      response,
      albumResult.statusCode,
    );
  }
}
