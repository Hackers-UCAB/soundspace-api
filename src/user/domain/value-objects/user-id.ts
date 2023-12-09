import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserIdException } from "../exceptions/invalid-user-id.exception";


export class UserId extends ValueObject<UserId>{

    private readonly id: string;

    constructor(id: string){
        let valid: boolean = true;
        
        if(!id) valid = false;

        if(!valid){
            throw new InvalidUserIdException(`Id '${id}' not valid`);
        }
        super()
        this.id=id       
    }

    equals(obj: UserId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): UserId {
        return new UserId(id);
    }
}