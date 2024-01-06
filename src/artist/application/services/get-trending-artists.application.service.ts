import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IArtistRepository } from "../../domain/repositories/artist.repository.interface";
import { GetTrendingArtistsEntryApplicationDto } from "../dto/entry/get-trending-artists-entry.application.dto";
import { GetTrendingArtistsResponseApplicationDto } from "../dto/response/get-trending-artists-response.application.dto";
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class GetTrendingArtistsService implements IApplicationService<
    GetTrendingArtistsEntryApplicationDto,
    GetTrendingArtistsResponseApplicationDto
> {

    private readonly ArtistRepository: IArtistRepository;
    private readonly getBufferImage: IGetBufferImageInterface;

    constructor(
        ArtistRepository: IArtistRepository,
        getBufferImage: IGetBufferImageInterface
    ) {
        this.ArtistRepository = ArtistRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: GetTrendingArtistsEntryApplicationDto): Promise<
        Result<GetTrendingArtistsResponseApplicationDto>
    > {

        //buscamos en el repositorio el artista por id
        const artistResult = await this.ArtistRepository.findTrendingArtists();

        if (!artistResult.IsSuccess) {
            return Result.fail<GetTrendingArtistsResponseApplicationDto>(
                null,
                artistResult.statusCode,
                artistResult.message,
                artistResult.error
            );
        }

        const artists = [];
        for (let i = 0; i < artistResult.Data.length; i++) {
            const artist = artistResult.Data[i];
            const imageResult = await this.getBufferImage.getFile(artist.Photo.Path);
            const artistObject = {
                id: artist.Id.Id,
                name: artist.Name.Name,
                image: imageResult.Data,
            };
            artists.push(artistObject);
        }

        const responseDto: GetTrendingArtistsResponseApplicationDto = {
            userId: param.userId,
            artists: artists
        };

        return Result.success<GetTrendingArtistsResponseApplicationDto>(responseDto, artistResult.statusCode);
    }

}