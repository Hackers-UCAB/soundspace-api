import { GetSongByIdResponseApplicationDto } from "../../../../song/application/dto/responses/get-song-by-id.response.application.dto";

export class GetPlaylistByIdResponseInfrastructureDto {
    id: string;
    name: string;
    duration: string;
    image: Buffer;
    creators?: {
        creatorId: string;
        creatorName: string;
    }[];
    songs: GetSongByIdResponseApplicationDto[];
}
