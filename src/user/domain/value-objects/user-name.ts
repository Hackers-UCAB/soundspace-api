import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserNameException } from "../exceptions/invalid-user-name.exception";

export class UserName extends ValueObject<UserName> {
    private readonly name: string;

    private constructor(name: string) {
        let valid: boolean = true;
        //Se chequean solo caracteres alfabeticos
        if(!/^[a-zA-Z ]+$/.test(name)){
            valid = false;
        }
        //El nombre debe ser mayor a 3 y menor a 50
        if ((name.length < 3) || (name.length > 50)) {
            valid = false;
        }

        if(!valid){
            throw new InvalidUserNameException(`El nombre ${name} no es valido.`);
        }

        super();
        this.name = name;
    }

    get Name(){
        return this.name;
    }

    equals(obj: UserName): boolean {
        return this.name === obj.name;
    }

    static create(name: string): UserName {
        return new UserName(name);
    }
}