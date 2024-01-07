import { Playlist } from "src/playlist/domain/playlist";
import { ServiceResponse } from "../../../../common/application/services/dto/response/service-response.dto";
import { Song } from "src/song/domain/song";
import { Artist } from "src/artist/domain/artist";

export class GetPlaylistByIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    playlist: Playlist;
    songs: {
        song: Song;
        artists: Artist []
    }[];
}

