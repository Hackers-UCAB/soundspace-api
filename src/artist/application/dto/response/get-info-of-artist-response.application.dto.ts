import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";

/*export class GetArtistByIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    id: string;
    name: string;
    genre: string;
    image: string;
    albums: string;
    songs: string;
}*/

export class AllArtistInfoDto implements ServiceResponse {
    userId: string;
    id: string;
    name: string;
    genre: string;
    image: Buffer;
    albums: {
        id: string,
        image: Buffer
    } [];
    songs: {
        id: string,
        duration: string,
        image: Buffer,
        artists: {
            id: string;
            name: string;
        } [];
    } [];
}