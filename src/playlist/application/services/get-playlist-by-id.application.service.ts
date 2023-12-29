import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IPlaylistRepository } from "../../domain/repositories/playlist.repository.interface";
import { PlaylistId } from "../../domain/value-objects/playlist-id";
import { GetPlaylistByIdEntryApplicationDto } from "../dto/entrys/get-playlist-by-id-entry.application.dto";
import { GetPlaylistByIdResponseApplicationDto } from "../dto/responses/get-playlist-by-id-response.application.dto";

export class GetPlaylistByIdService implements IApplicationService<GetPlaylistByIdEntryApplicationDto, GetPlaylistByIdResponseApplicationDto>{

    private readonly PlaylistRepository: IPlaylistRepository;
    songRepository: any;

    constructor(PlaylistRepository: IPlaylistRepository) {
        this.PlaylistRepository = PlaylistRepository;
    }

    async execute(param: GetPlaylistByIdEntryApplicationDto): Promise<Result<GetPlaylistByIdResponseApplicationDto>> {

        console.log("param: ", param);
        //creamos el value object de Playlist Id
        const playlistId = PlaylistId.create(param.PlaylistId);

        console.log("playlistId: ", playlistId);
        //buscamos en el repositorio la playlist por id
        const playlistResult = await this.PlaylistRepository.findPlaylistById(playlistId);
        console.log("playlistResult: ", playlistResult);
        if (!playlistResult.IsSuccess) {
            return Result.fail<GetPlaylistByIdResponseApplicationDto>(null, playlistResult.statusCode, playlistResult.message, playlistResult.error);
        }
        //return Result.success<GetPlaylistByIdResponseApplicationDto>(playlistResult.Data, playlistResult.statusCode);
     
        /*
        //buscamos todas las canciones relacionadas a ese playlist para crear el songResponseDto
        for (const songId of playlistResult.data.PlaylistSongs.Songs) {
            const song = await this.songRepository.findSongById(songId);
            if (!song.IsSuccess) {
                return Result.fail<GetPlaylistByIdResponseApplicationDto>(null, song.statusCode, song.message, song.error);
            }
            //buscamos al artista de la cancion
            const artist = await this.artistRepository.findArtistBySongId(songId);
            console.log("songId: ", songId);
        }
        */
    }

}
