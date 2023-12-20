import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserTokenException } from "../exceptions/invalid-user-token.exception";


export class UserToken extends ValueObject<UserToken>{
    private readonly tokens: string[];

    private constructor(tokens: string[]){
        let valid: boolean = true;
        if(!tokens) valid = false;

        if(!valid){
            throw new InvalidUserTokenException('Token not valid');
        }
        super();
        this.tokens = tokens;
    }

    get Token(){
        return this.tokens;
    }
    
    equals(obj: UserToken): boolean {
        return this.tokens === obj.tokens;
    }

    static create(tokens: string[]): UserToken {
        return new UserToken(tokens);
    }
}