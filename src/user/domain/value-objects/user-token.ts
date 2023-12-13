import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserTokenException } from "../exceptions/invalid-user-token.exception";


export class UserToken extends ValueObject<UserToken>{
    private readonly token: string;

    private constructor(token: string){
        let valid: boolean = true;
        if(!token) valid = false;

        if(!valid){
            throw new InvalidUserTokenException('Token not valid');
        }
        super();
        this.token = token;
    }

    get Token(){
        return this.token;
    }
    
    equals(obj: UserToken): boolean {
        return this.token === obj.token;
    }

    static create(token: string): UserToken {
        return new UserToken(token);
    }
}