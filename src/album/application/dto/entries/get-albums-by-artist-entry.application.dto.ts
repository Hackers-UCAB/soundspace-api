import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

export class GetAlbumsByArtistEntryApplicationDto implements ServiceEntry {
  userId: string;
  artistId: string;
}
