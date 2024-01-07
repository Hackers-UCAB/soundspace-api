import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IArtistRepository } from "../../domain/repositories/artist.repository.interface";
import { ArtistId } from "../../domain/value-objects/artist-id";
import { GetArtistByIdEntryApplicationDto } from "../dto/entry/get-artist-by-id-entry.application.dto";
import { GetArtistByIdResponseApplicationDto } from "../dto/response/get-artist-by-id-response.application.dto";
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class GetArtistByIdService implements IApplicationService<
    GetArtistByIdEntryApplicationDto,
    GetArtistByIdResponseApplicationDto
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

    async execute(param: GetArtistByIdEntryApplicationDto): Promise<Result<GetArtistByIdResponseApplicationDto>> {

        //creamos el value object de Artist Id
        const artistId = ArtistId.create(param.artistId);

        //buscamos en el repositorio el artista por id
        const artistResult = await this.artistRepository.findArtistById(artistId);

        if (!artistResult.IsSuccess) {
            return Result.fail<GetArtistByIdResponseApplicationDto>(
                null, 
                artistResult.statusCode, 
                artistResult.message, 
                artistResult.error
                );
        }

        const artist = artistResult.Data;
        const imageResult = await this.getBufferImage.getFile(artist.Photo.Path);
        const artistObject = {
            id: artist.Id.Id,
            name : artist.Name.Name,
            image: imageResult.Data,
        };

        const responseDto: GetArtistByIdResponseApplicationDto = {
            userId: param.userId,
            artist: artistObject
        };

        return Result.success<GetArtistByIdResponseApplicationDto>(responseDto, artistResult.statusCode);
    }

}