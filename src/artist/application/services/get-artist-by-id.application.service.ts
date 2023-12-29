import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IArtistRepository } from "../../domain/repositories/artist.repository.interface";
import { ArtistId } from "../../domain/value-objects/artist-id";
import { GetArtistByIdEntryApplicationDto } from "../dto/entry/get-artist-by-id-entry.application.dto";
import { GetArtistByIdResponseApplicationDto } from "../dto/response/get-artist-by-id-response.application.dto";

export class GetArtistByIdService implements IApplicationService<GetArtistByIdEntryApplicationDto, GetArtistByIdResponseApplicationDto>{

    private readonly ArtistRepository: IArtistRepository;

    constructor(ArtistRepository: IArtistRepository) {
        this.ArtistRepository = ArtistRepository;
    }

    async execute(param: GetArtistByIdEntryApplicationDto): Promise<Result<GetArtistByIdResponseApplicationDto>> {

        //creamos el value object de Artist Id
        const artistId = ArtistId.create(param.artistId);

        //buscamos en el repositorio el artista por id
        const artistResult = await this.ArtistRepository.findArtistById(artistId);

        if (!artistResult.IsSuccess) {
            return Result.fail<GetArtistByIdResponseApplicationDto>(null, artistResult.statusCode, artistResult.message, artistResult.error);
        }

        const responseDto: GetArtistByIdResponseApplicationDto = {
            userId: param.userId,
            id: artistResult.Data.Id.Id,
            name: artistResult.Data.Name.Name,
            image: artistResult.Data.Photo.Path
        };

        return Result.success<GetArtistByIdResponseApplicationDto>(responseDto, artistResult.statusCode);
    }

}