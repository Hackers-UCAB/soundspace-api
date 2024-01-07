import { Album } from "src/album/domain/album";
import { Artist } from "src/artist/domain/artist";
import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";
import { Song } from "src/song/domain/song";

export class GetArtistByIdResponseApplicationDto implements ServiceResponse {
    userId: string;
    artist: Artist;
    albums: Album[];
    songs: {
        song: Song;
        artists: Artist[];
    }[];
}