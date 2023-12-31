import { Res } from "@nestjs/common";
import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IGetBufferImageInterface } from "../../../common/domain/interfaces/get-buffer-image.interface";
import { ISongRepository } from "../../domain/repositories/song.repository.interface";
import { GetTopSongsEntryApplicationDto } from "../dto/entrys/get-top-songs.entry.application.dto";
import { GetTopSongsResponseApplicationDto } from "../dto/responses/get-top-songs.response.application.dto";

export class GetTopSongsService implements IApplicationService<GetTopSongsEntryApplicationDto, GetTopSongsResponseApplicationDto>{

    private readonly SongRepository: ISongRepository;
    private readonly getBufferImage: IGetBufferImageInterface;

    constructor(SongRepository: ISongRepository, getBufferImage: IGetBufferImageInterface) {
        this.SongRepository = SongRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: GetTopSongsEntryApplicationDto): Promise<Result<GetTopSongsResponseApplicationDto>> {
        const SongsResult = await this.SongRepository.findTopSongs();
        if (!SongsResult.IsSuccess) {
            return Result.fail<GetTopSongsResponseApplicationDto>(null, SongsResult.statusCode, SongsResult.message, SongsResult.error);
        }
        console.log(SongsResult.Data);
        const songs = [];
        for (let i = 0; i < SongsResult.Data.length; i++) {
            const song = SongsResult.Data[i];

            const imageResult = await (await this.getBufferImage.getFile(song.Cover.Path)).Data;
            const songObject = {
                songId: song.Id.Id,
                name: song.Name.Name,
                image: imageResult,
                duration: this.conversorTiempo(song.Duration.Duration),
                artists : []
            };
            songs.push(songObject);
            
            /* aqui buscamos a los artistas by songId
            for (const artist of response.songs[i].artists) {
                //const artist = await this.artistRepository.findArtistBySongId(songId);
            }
            */
        }
        const response: GetTopSongsResponseApplicationDto = {
            userId: param.userId,
            songs: songs
        };
        return Result.success<GetTopSongsResponseApplicationDto>(response, SongsResult.statusCode);
    }

    conversorTiempo(tiempo: number): string {
        let horas = 0;
        let minutos = 0;
        let resultado = '';
        if (tiempo >= 3600) {
            horas = Math.floor(tiempo / 3600);
            tiempo = Math.floor(tiempo % 3600);
            resultado = resultado + horas + ':';
        }
        minutos = Math.floor(tiempo / 60);
        tiempo = Math.floor(tiempo % 60);
        resultado = resultado + (minutos < 10 && horas > 0 ? '0' + minutos : minutos) + ':';
        return resultado + (tiempo < 10 ? '0' + tiempo : tiempo);
    }

}
