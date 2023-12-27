import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { UserId } from "src/user/domain/value-objects/user-id";
import { UserRole } from "src/user/domain/value-objects/user-role";

export class UpdateUserInfoEntryApplicationDto implements ServiceEntry{
    userId: string;
    name?: string;
    email?: string;
    birthdate?: Date;
    gender?: string;
  }
  