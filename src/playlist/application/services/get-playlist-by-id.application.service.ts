import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IPlaylistRepository } from "../../domain/repositories/playlist.repository.interface";
import { PlaylistIdEntryApplicationDto } from "../dto/entrys/playlist-id-entry.application.dto";
import { PlaylistResponseApplicationDto } from "../dto/responses/playlist-response.application.dto";

export class GetPlaylistByIdService implements IApplicationService<string, PlaylistResponseApplicationDto>{

    private readonly PlaylistRepository: IPlaylistRepository;

    constructor(PlaylistRepository: IPlaylistRepository) {
        this.PlaylistRepository = PlaylistRepository;
    }

    async execute(param: string): Promise<Result<PlaylistResponseApplicationDto>> {

        //const PlaylistResponseApplicationDto = await this.PlaylistRepository.findPlaylistById(param.PlaylistId);
        const response: PlaylistResponseApplicationDto = {
            userId:"userId",
            name:"nombre de playlist"
        }
        return Result.success(response, 200);
    }
}