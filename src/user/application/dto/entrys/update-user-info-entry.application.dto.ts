import { UserId } from "src/user/domain/value-objects/user-id";
import { UserRole } from "src/user/domain/value-objects/user-role";

export class UpdateUserInfoEntryApplicationDto {
    id: UserId;
    role: UserRole;
    name?: string;
    email?: string;
    birthdate?: Date;
    gender?: string;
  }
  