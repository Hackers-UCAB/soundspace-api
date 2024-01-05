import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";

export class GetArtistBySongIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    artist: {
        id: string;
        name: string;
        image: Buffer;
    };
}