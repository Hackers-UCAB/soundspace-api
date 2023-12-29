import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class GetArtistByIdEntryApplicationDto implements ServiceEntry {
    userId: string;
    artistId: string;
}