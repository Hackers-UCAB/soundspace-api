import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";
import { Song } from "src/song/domain/song";
import { Artist } from "src/artist/domain/artist";

export class GetTopSongsResponseApplicationDto implements ServiceResponse {
    userId: string;
    songs: {
        song: Song;
        artists: Artist[]
    }[];
}
