import { ServiceResponse } from '../../../../common/application/services/dto/response/service-response.dto';
export class GetAlbumByIdResponseApplicationDto implements ServiceResponse {
  userId: string;
  id: string;
  name: string;
  cover: string;
  duration: string;
  genre: string;
}

/*
export class AlbumResponseApplicationDto implements ServiceResponse {
    userId: string;
    id: string;
    name: string;
    duration: string;
    im: Buffer;
    creators?: {
        creatorId: string;
        creatorName: string;
    }[];
    songs: SongResponseApplicationDtoDto[];
}
*/
