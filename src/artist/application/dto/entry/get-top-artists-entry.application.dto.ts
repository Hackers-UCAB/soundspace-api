import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class GetTopArtistsByIdEntryApplicationDto implements ServiceEntry {
    userId: string;
}