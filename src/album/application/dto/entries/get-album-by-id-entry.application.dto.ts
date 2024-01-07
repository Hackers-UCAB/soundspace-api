import { ServiceEntry } from '../../../../common/application/services/dto/entry/service-entry.dto';

export class GetAlbumByIdEntryApplicationDto implements ServiceEntry {
  userId: string;
  albumId: string;
}
