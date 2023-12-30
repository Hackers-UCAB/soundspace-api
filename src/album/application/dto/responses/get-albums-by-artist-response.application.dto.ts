import { ServiceResponse } from '../../../../common/application/services/dto/response/service-response.dto';

export class GetAlbumsByArtistResponseApplicationDto
  implements ServiceResponse
{
  userId: string;
  albums: {
    id: string;
    image: Buffer;
  }[];
}
