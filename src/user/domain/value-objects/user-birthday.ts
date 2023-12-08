import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserBirthdayException } from "../exceptions/invalid-user-birthday.exception";


export class UserBirthday extends ValueObject<UserBirthday>{

    private readonly birthday: Date;

    private constructor(birthday: Date){
        let valid: boolean = true;
        //se valida que la fecha no sea en futuro
        if(birthday > new Date()){
            valid = false;
        }

        if(!valid){
            throw new InvalidUserBirthdayException(`La fecha ${birthday} no es valida.`);
        }
        
        super();
        this.birthday = birthday;
    }

    get Birthday(){
        return this.birthday;
    }

    equals(obj: UserBirthday): boolean {
        return this.birthday === obj.birthday;
    }

    static create(birthday: Date): UserBirthday {
        return new UserBirthday(birthday);
    }
}