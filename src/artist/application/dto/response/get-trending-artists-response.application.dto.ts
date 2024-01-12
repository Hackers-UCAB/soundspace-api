import { Artist } from "src/artist/domain/artist";
import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";

export class GetTrendingArtistsResponseApplicationDto implements ServiceResponse {
    userId: string;
    artists: Artist[];
}