import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class GetTopEntryApplicationDto implements ServiceEntry {
    userId: string;
}