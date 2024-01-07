import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class SearchItemsEntryApplicationDto implements ServiceEntry{
    userId: string;
    name: string;
    limit?: number;
    offset?: number;
}