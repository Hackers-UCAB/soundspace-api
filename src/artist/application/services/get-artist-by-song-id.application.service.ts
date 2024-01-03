import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IArtistRepository } from "../../domain/repositories/artist.repository.interface";
import { SongId } from "src/song/domain/value-objects/song-id";
import { GetArtistBySongIdEntryApplicationDto } from "../dto/entry/get-artist-by-song-id-entry.application.dto";
import { GetArtistBySongIdResponseApplicationDto } from "../dto/response/get-artist-by-song-id-responde.application.dto";
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';

export class GetArtistBySongIdService implements IApplicationService<
    GetArtistBySongIdEntryApplicationDto,
    GetArtistBySongIdResponseApplicationDto
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

    async execute(param: GetArtistBySongIdEntryApplicationDto): Promise<Result<GetArtistBySongIdResponseApplicationDto>> {

        //creamos el value object de Song Id
        const songId = SongId.create(param.songId);

        //buscamos en el repositorio el artista por id
        const artistResult = await this.ArtistRepository.findArtistBySongId(songId);

        if (!artistResult.IsSuccess) {
            return Result.fail<GetArtistBySongIdResponseApplicationDto>(
                null,
                artistResult.statusCode,
                artistResult.message,
                artistResult.error
            );
        }

        const artist = artistResult.Data[0];
        const imageResult = await this.getBufferImage.getFile(artist.Cover.Path);
        const artistObject = {
            id: artist.Id.Id,
            name : artist.Name.Name,
            image: imageResult.Data,
        };

        const responseDto: GetArtistBySongIdResponseApplicationDto = {
            userId: param.userId,
            artist: artistObject
        };

        return Result.success<GetArtistBySongIdResponseApplicationDto>(responseDto, artistResult.statusCode);
    }

}