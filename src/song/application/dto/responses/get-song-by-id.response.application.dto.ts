import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";

export class GetSongByIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    songId: string;
    name: string;
    duration: string;
    artists: {
        id: string;
        name: string;
    }[];
}
