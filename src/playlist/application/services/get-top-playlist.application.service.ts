import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IGetBufferImageInterface } from "../../../common/domain/interfaces/get-buffer-image.interface";
import { SongRepository } from "../../../song/infraestructure/repositories/song.repository";
import { IPlaylistRepository } from "../../domain/repositories/playlist.repository.interface";
import { PlaylistId } from "../../domain/value-objects/playlist-id";
import { GetPlaylistByIdEntryApplicationDto } from "../dto/entrys/get-playlist-by-id-entry.application.dto";
import { TopPlaylistEntryApplicationDto } from "../dto/entrys/get-top-playlist-entry.application.dto";
import { GetPlaylistByIdResponseApplicationDto } from "../dto/responses/get-playlist-by-id-response.application.dto";
import { GetTopPlaylistResponseApplicationDto } from "../dto/responses/get-top-playlist-response.application.dto";

export class GetTopPlaylistService implements IApplicationService<TopPlaylistEntryApplicationDto, GetTopPlaylistResponseApplicationDto>{

    private readonly PlaylistRepository: IPlaylistRepository;
    private readonly getBufferImage: IGetBufferImageInterface;
    songRepository: SongRepository;

    constructor(PlaylistRepository: IPlaylistRepository, getBufferImage: IGetBufferImageInterface) {
        this.PlaylistRepository = PlaylistRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: TopPlaylistEntryApplicationDto): Promise<Result<GetTopPlaylistResponseApplicationDto>> {
        const playlistResult = await this.PlaylistRepository.findTopPlaylist();
        if (!playlistResult.IsSuccess) {
            return Result.fail<GetTopPlaylistResponseApplicationDto>(null, playlistResult.statusCode, playlistResult.message, playlistResult.error);
        }

        const playlists = [];
        for (let i = 0; i < playlistResult.Data.length; i++) {
            const playlist = playlistResult.Data[i];
            const imageResult = await this.getBufferImage.getFile(playlist.Cover.Path);
            const playlistObject = {
                id: playlist.Id.Id,
                image: imageResult.Data
            };
            playlists.push(playlistObject);
        }
        const response: GetTopPlaylistResponseApplicationDto = {
            userId: param.userId,
            playlists: playlists
        };
        return Result.success<GetTopPlaylistResponseApplicationDto>(response, playlistResult.statusCode);
    }



}
