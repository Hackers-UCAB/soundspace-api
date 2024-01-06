import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class SearchEntryApplicationDto implements ServiceEntry{
    userId: string;
    types: string []; 
    name: string;
    limit : number;
    offset : number;
}