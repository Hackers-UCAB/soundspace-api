import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IArtistRepository } from '../../domain/repositories/artist.repository.interface';
import { GetTrendingArtistsResponseApplicationDto } from '../dto/response/get-trending-artists-response.application.dto';
import { Artist } from 'src/artist/domain/artist';

export class GetTrendingArtistsService
  implements
    IApplicationService<ServiceEntry, GetTrendingArtistsResponseApplicationDto>
{
  private readonly artistRepository: IArtistRepository;

  constructor(artistRepository: IArtistRepository) {
    this.artistRepository = artistRepository;
  }

  async execute(
    param: ServiceEntry,
  ): Promise<Result<GetTrendingArtistsResponseApplicationDto>> {
    //buscamos en el repositorio el artista por id
    const artistResult: Result<Artist[]> =
      await this.artistRepository.findTrendingArtists();

    if (!artistResult.IsSuccess) {
      return Result.fail<GetTrendingArtistsResponseApplicationDto>(
        null,
        artistResult.statusCode,
        artistResult.message,
        artistResult.error,
      );
    }

    const responseDto: GetTrendingArtistsResponseApplicationDto = {
      userId: param.userId,
      artists: artistResult.Data,
    };

    return Result.success<GetTrendingArtistsResponseApplicationDto>(
      responseDto,
      artistResult.statusCode,
    );
  }
}
