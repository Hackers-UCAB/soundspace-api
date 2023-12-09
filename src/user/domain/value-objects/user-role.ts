import { ValueObject } from "src/common/domain/value-object";
import { UserGenderEnum } from "./enum/user-gender.enum";
import { InvalidUserGenderException } from "../exceptions/invalid-user-gender.exception";
import { UserRoleEnum } from "./enum/user-role.enum";


export class UserRole extends ValueObject<UserRole> {
    private readonly role: UserRoleEnum;

    private constructor(role: UserRoleEnum){ {
        let valid: boolean = true;

        if(!Object.values(UserRoleEnum).includes(role)){
            valid = false;
        }

        if(!valid){
            throw new InvalidUserGenderException(`role ${role} not valid.`);
        }
        super();
        this.role = role;
    }
    }

    get Role(){
        return this.role;
    }

    equals(obj: UserRole): boolean {
        return this.role === obj.role;
    }

    static create(role: UserRoleEnum): UserRole {
        return new UserRole(role);
    }

}