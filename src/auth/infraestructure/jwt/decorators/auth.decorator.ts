import { UseGuards, applyDecorators } from "@nestjs/common";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { RoleProtected } from "./role-protected/role-protected.decorator";
import { UserRoleGuard } from "../guards/user-role.guard";
import { AuthGuard } from "@nestjs/passport";


export function Auth(...roles: UserRoleEnum[]){
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    )
}