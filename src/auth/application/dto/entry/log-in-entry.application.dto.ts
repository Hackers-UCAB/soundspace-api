import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";

export class LogInEntryApplicationDto implements ServiceEntry{
    userId: string;
    phone: string;
    token: string;
}