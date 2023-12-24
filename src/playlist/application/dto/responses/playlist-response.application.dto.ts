import { ServiceResponse } from "../../../../common/application/services/response/service-response";

export class SongResponseApplicationDtoDto {
    songId: string;
    name: string;
    duration: string;
    artists: {
        id: string;
        name: string;
    }[];
}

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

/*
export class PlaylistResponseApplicationDto implements ServiceResponse {
    userId: string;
    name: string;
}
*/