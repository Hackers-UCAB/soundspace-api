import { ServiceEntry } from '../../../../common/application/services/dto/entry/service-entry.dto';

export class GetPlaylistByIdEntryApplicationDto implements ServiceEntry {
  userId: string;
  playlistId: string;
}
