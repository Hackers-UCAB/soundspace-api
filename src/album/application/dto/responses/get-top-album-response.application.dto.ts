import { ServiceResponse } from '../../../../common/application/services/dto/response/service-response.dto';
import { Album } from 'src/album/domain/album';
export class GetTopAlbumResponseApplicationDto implements ServiceResponse {
  userId: string;
  albums: Album[];
}
