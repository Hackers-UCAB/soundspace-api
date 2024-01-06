import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class GetTrendingArtistsEntryApplicationDto implements ServiceEntry {
    userId: string;
}