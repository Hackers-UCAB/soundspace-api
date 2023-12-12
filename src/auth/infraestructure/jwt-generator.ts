import { JwtService } from "@nestjs/jwt";
import { IJwtGenerator } from "../application/interface/jwt-generator.interface";
import { JwtPayload } from "./jwt-payload.interface";


export class JwtGenerator implements IJwtGenerator {
    private readonly jwt: JwtService
    constructor(jwt: JwtService) {
        this.jwt = jwt
    }
    create(param: JwtPayload): string {
        return this.jwt.sign(param)
    }
}