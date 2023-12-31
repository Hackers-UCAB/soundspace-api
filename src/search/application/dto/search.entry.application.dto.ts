import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class SearchEntryApplicationDto implements ServiceEntry{
    userId: string;
    type: string; 
    name: string;
}