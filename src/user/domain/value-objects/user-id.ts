import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserIdException } from "../exceptions/invalid-user-id.exception";


export class UserId extends ValueObject<UserId>{

    private readonly id: string;

    constructor(id: string){
        super()
        if(id){
            this.id = id;
        }else{
            throw new InvalidUserIdException(`El id ${id} no es valido.`);
        }
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