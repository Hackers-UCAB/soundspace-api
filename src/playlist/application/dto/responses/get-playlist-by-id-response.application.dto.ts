import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";

export class GetPlaylistByIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    id: string;
    name: string;
    cover: string;
    duration: string;
}

/*
export class PlaylistResponseApplicationDto implements ServiceResponse {
    userId: string;
    id: string;
    name: string;
    duration: string;
    im: Buffer;
    creators?: {
        creatorId: string;
        creatorName: string;
    }[];
    songs: SongResponseApplicationDtoDto[];
}
*/
