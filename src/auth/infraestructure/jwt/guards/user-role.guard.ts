import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { META_ROLES } from "../decorators/role-protected/role-protected.decorator";
import { HttpResponseHandler } from "src/common/infraestructure/http-response-handler/http-response.handler";


@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
        if(!validRoles){
            return true;
        }

        if(validRoles.length === 0){
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if(!user){
            HttpResponseHandler.HandleException(404, 'User not found', new Error('User not found'));
        }
        for(const role of validRoles){
            if(user.role.Role.includes(role)){
                return true;
            }
        }
        HttpResponseHandler.HandleException(403, 'Este usuario no tiene permitido esta acción', new Error('Este usuario no tiene permitido esta acción'));
    }

    
}