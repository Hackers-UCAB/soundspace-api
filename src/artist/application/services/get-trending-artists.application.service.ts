import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { GetTopEntryApplicationDto } from "../../../common/application/top/dto/entry/get-top.entry.dto";
import { IArtistRepository } from "../../domain/repositories/artist.repository.interface";
import { GetTrendingArtistsResponseApplicationDto } from "../dto/response/get-trending-artists-response.application.dto";
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class GetTrendingArtistsService implements IApplicationService<
    GetTopEntryApplicationDto,
    GetTrendingArtistsResponseApplicationDto
> {

    private readonly artistRepository: IArtistRepository;
    private readonly getBufferImage: IGetBufferImageInterface;

    constructor(
        artistRepository: IArtistRepository,
        getBufferImage: IGetBufferImageInterface
    ) {
        this.artistRepository = artistRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: GetTopEntryApplicationDto): Promise<
        Result<GetTrendingArtistsResponseApplicationDto>
    > {

        //buscamos en el repositorio el artista por id
        const artistResult = await this.artistRepository.findTrendingArtists();

        if (!artistResult.IsSuccess) {
            return Result.fail<GetTrendingArtistsResponseApplicationDto>(
                null,
                artistResult.statusCode,
                artistResult.message,
                artistResult.error
            );
        }

        /*const artists = [];
        for (let i = 0; i < artistResult.Data.length; i++) {
            const artist = artistResult.Data[i];
            const imageResult = await this.getBufferImage.getFile(artist.Photo.Path);
            const artistObject = {
                id: artist.Id.Id,
                name: artist.Name.Name,
                image: imageResult.Data,
            };
            artists.push(artistObject);
        }*/

        const responseDto: GetTrendingArtistsResponseApplicationDto = {
            userId: param.userId,
            artists: artistResult.Data,
        };

        return Result.success<GetTrendingArtistsResponseApplicationDto>(responseDto, artistResult.statusCode);
    }

}