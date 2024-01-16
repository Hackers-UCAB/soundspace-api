import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";


export class UpdateUserInfoEntryApplicationDto implements ServiceEntry{
    userId: string;
    name?: string;
    email?: string;
    birthdate?: Date;
    gender?: string;
  }
  