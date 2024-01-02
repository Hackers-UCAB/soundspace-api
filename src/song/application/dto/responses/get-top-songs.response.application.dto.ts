import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";

export class GetTopSongsResponseApplicationDto implements ServiceResponse {
    userId: string;
    songs: {
        songId: string;
        name: string;
        image: Buffer;
        duration: string;
        artists: {
            id: string;
            name: string;
        }[];
    }[];
}
