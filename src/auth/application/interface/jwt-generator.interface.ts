import { JwtPayload } from "src/auth/infraestructure/jwt-payload.interface"


export interface IJwtGenerator {
    create(param: JwtPayload): string
}