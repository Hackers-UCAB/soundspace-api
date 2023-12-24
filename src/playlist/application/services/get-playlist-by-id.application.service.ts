import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IPlaylistRepository } from "../../domain/repositories/playlist.repository.interface";
import { GetPlaylistByIdEntryApplicationDto } from "../dto/entrys/get-playlist-by-id-entry.application.dto";
import { PlaylistResponseApplicationDto } from "../dto/responses/playlist-response.application.dto";

export class GetPlaylistByIdService implements IApplicationService<GetPlaylistByIdEntryApplicationDto, PlaylistResponseApplicationDto>{

    private readonly PlaylistRepository: IPlaylistRepository;

    constructor(PlaylistRepository: IPlaylistRepository) {
        this.PlaylistRepository = PlaylistRepository;
    }

    async execute(PlaylistIdEntryApplicationDto: GetPlaylistByIdEntryApplicationDto): Promise<Result<PlaylistResponseApplicationDto>> {

        const PlaylistResponseApplicationDto = await this.PlaylistRepository.findPlaylistById(PlaylistIdEntryApplicationDto);

        return Result.success(PlaylistResponseApplicationDto, 200);
    }
}
