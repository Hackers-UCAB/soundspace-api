import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";

export class GetTopPlaylistResponseApplicationDto implements ServiceResponse {
    userId: string;
    playlists: {
        id: string;
        image: Buffer;
    }[];
}
