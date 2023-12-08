import { ValueObject } from "src/common/domain/value-object";
import { UserGenderEnum } from "./enum/user-gender.enum";
import { InvalidUserGenderException } from "../exceptions/invalid-user-gender.exception";


export class UserGender extends ValueObject<UserGender> {
    private readonly gender: UserGenderEnum;

    private constructor(gender: UserGenderEnum) {
        let valid: boolean = true;

        if(!Object.values(UserGenderEnum).includes(gender)){
            valid = false;
        }

        if(!valid){
            throw new InvalidUserGenderException(`El genero ${gender} no es valido.`);
        }
        super();
        this.gender = gender;
    }

    get Gender(){
        return this.gender;
    }

    equals(obj: UserGender): boolean {
        return this.gender === obj.gender;
    }

    static create(gender: UserGenderEnum): UserGender {
        return new UserGender(gender);
    }

}