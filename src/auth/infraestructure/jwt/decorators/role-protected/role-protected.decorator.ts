import { SetMetadata } from "@nestjs/common";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";

export const META_ROLES = 'roles';

export const RoleProtected = (...args: UserRoleEnum[]) => {
    return SetMetadata(META_ROLES, args);
}