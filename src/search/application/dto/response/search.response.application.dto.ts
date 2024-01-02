import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";


export class SearchResponseApplicationDto implements ServiceResponse{
    userId: string;
    playlists?: {
        id: string;
        name: string;
    }[];
    songs?: {
        id: string;
        name: string;
    }[];
    albums?: {
        id: string;
        name: string;
    }[];
    artists?: {
        id: string;
        name: string;
    }[];
}