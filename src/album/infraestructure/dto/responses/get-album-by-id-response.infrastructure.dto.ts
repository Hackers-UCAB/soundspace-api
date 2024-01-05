import { GetSongByIdResponseApplicationDto } from '../../../../song/application/dto/responses/get-song-by-id.response.application.dto';
export class GetAlbumByIdResponseInfrastructureDto {
  id: string;
  name: string;
  duration: string;
  genre: string;
  im: Buffer;
  creators?: {
    creatorId: string;
    creatorName: string;
  }[];
  songs: GetSongByIdResponseApplicationDto[];
}
