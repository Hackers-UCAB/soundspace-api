import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../../jwt-payload.interface";


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            secretOrKey: process.env.JWT_SECRET,
            JwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload){
        return payload;
    }
}