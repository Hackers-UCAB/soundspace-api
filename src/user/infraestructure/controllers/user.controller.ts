import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Auth } from "src/auth/infraestructure/jwt/decorators/auth.decorator";
import { GetUser } from "src/auth/infraestructure/jwt/decorators/get-user.decorator";
import { User } from "src/user/domain/user";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";

@Controller('user')
export class UserController {

    constructor() {}

    @Get()
    @Auth(UserRoleEnum.USER)
    //@UseGuards(AuthGuard())
    async getAll(@GetUser() user: User) {
        console.log(user);
        
        return `Si entro en esta monda con el user`;
    }
}