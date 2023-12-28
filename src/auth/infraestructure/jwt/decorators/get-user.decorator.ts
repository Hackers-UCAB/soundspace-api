import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { HttpResponseHandler } from "src/common/infraestructure/http-response-handler/http-response.handler";


export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        if (!request.user) {
            HttpResponseHandler.HandleException(
                404,
                'No se ha encontrado el usuario (request)',
                new Error('No se ha encontrado el usuario (request)'),
            );
        }
        const user = request.user;

        if (!data) return user;

        return user[data];
    }
)