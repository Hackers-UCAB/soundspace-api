import { ServiceEntry } from "../../../../common/application/services/dto/entry/service-entry.dto";

export class GetTopSongsEntryApplicationDto implements ServiceEntry {
    userId: string;
}
