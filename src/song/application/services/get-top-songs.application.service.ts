import { Res } from "@nestjs/common";
import { Artist } from 'src/artist/domain/artist';
import { IArtistRepository } from "../../../artist/domain/repositories/artist.repository.interface";
import { Result } from "../../../common/application/result-handler/result";
import { ServiceEntry } from "../../../common/application/services/dto/entry/service-entry.dto";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IGetBufferImageInterface } from "../../../common/domain/interfaces/get-buffer-image.interface";
import { ISongRepository } from "../../domain/repositories/song.repository.interface";
import { Song } from "../../domain/song";
import { GetTopSongsResponseApplicationDto } from "../dto/responses/get-top-songs.response.application.dto";

export class GetTopSongsService implements IApplicationService<ServiceEntry, GetTopSongsResponseApplicationDto>{

    private readonly SongRepository: ISongRepository;
    private readonly artistRepository: IArtistRepository;
    private readonly getBufferImage: IGetBufferImageInterface;

    constructor(SongRepository: ISongRepository, artistRepository: IArtistRepository, getBufferImage: IGetBufferImageInterface) {
        this.SongRepository = SongRepository;
        this.artistRepository = artistRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: ServiceEntry): Promise<Result<GetTopSongsResponseApplicationDto>> {
        const SongsResult = await this.SongRepository.findTopSongs();
        if (!SongsResult.IsSuccess) {
            return Result.fail<GetTopSongsResponseApplicationDto>(null, SongsResult.statusCode, SongsResult.message, SongsResult.error);
        }
        let songs: {
            song: Song;
            artists: Artist[];
        }[] = [];
        //buscamos todas las canciones relacionadas a ese playlist para crear el arreglo de Song []
        for (const song of SongsResult.Data) {

            const artist: Result<Artist[]> =
                await this.artistRepository.findArtistsBySongId(song.Id);

            if (!artist.IsSuccess) {
                return Result.fail<GetTopSongsResponseApplicationDto>(null, artist.statusCode, artist.message, artist.error,);
            }
            songs.push({
                song: song,
                artists: artist.Data,
            });
        }

        const songResponseDto: GetTopSongsResponseApplicationDto = {
            userId: param.userId,
            songs: songs
        };

        return Result.success(songResponseDto, 200);
    }
}
