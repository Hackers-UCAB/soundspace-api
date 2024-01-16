import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";
import { Playlist } from "src/playlist/domain/playlist";
export class GetTopPlaylistResponseApplicationDto implements ServiceResponse {
    userId: string;
    playlists: Playlist[];
}
