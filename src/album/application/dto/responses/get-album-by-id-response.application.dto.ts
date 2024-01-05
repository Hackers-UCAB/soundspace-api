import { ServiceResponse } from '../../../../common/application/services/dto/response/service-response.dto';
import { GetSongByIdResponseApplicationDto } from '../../../../song/application/dto/responses/get-song-by-id.response.application.dto';
export class GetAlbumByIdResponseApplicationDto implements ServiceResponse {
  userId: string;
  id: string;
  name: string;
  //cover: string;
  duration: string;
  genre: string;
  im: Buffer;
  creators?: {
    creatorId: string;
    creatorName: string;
  }[];
  songs: GetSongByIdResponseApplicationDto[];
}
