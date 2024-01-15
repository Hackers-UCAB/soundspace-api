import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";

export class PlaySongResponseApplicationDto implements ServiceResponse{
    userId: string;
    success: boolean
}