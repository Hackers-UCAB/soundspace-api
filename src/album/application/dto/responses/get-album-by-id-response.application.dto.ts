import { Song } from 'src/song/domain/song';
import { ServiceResponse } from '../../../../common/application/services/dto/response/service-response.dto';
import { Album } from 'src/album/domain/album';
import { Artist } from 'src/artist/domain/artist';
export class GetAlbumByIdResponseApplicationDto implements ServiceResponse {
  userId: string;
  album: Album;
  creators: Artist[];
  songs: {
    song: Song;
    artists: Artist[];
  }[];
}
