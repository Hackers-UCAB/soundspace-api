import { JwtPayload } from "src/auth/application/interface/jwt-payload.interface"


export interface IJwtGenerator {
    create(param: JwtPayload): string
}