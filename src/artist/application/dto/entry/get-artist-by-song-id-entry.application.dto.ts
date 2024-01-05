import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class GetArtistBySongIdEntryApplicationDto implements ServiceEntry {
    userId: string;
    songId: string;
}