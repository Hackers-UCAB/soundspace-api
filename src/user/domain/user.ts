import { AggregateRoot } from "src/common/domain/aggregate-root";
import { UserId } from "./value-objects/user-id";
import { UserName } from "./value-objects/user-name";
import { UserEmail } from "./value-objects/user-email";
import { UserGender } from "./value-objects/user-gender";
import { UserRole } from "./value-objects/user-role";
import { UserPhone } from "./value-objects/user-phone";
import { UserBirthday } from './value-objects/user-birthday';

export class User extends AggregateRoot<UserId>{

    private  userName: UserName
    private  userBirthday: UserBirthday
    private  userEmail: UserEmail
    private  userGender: UserGender
    private  userRole: UserRole
    private  userPhoneNumber: UserPhone

    get UserName(): UserName {
        return this.userName;
    }
    get UserEmail(): UserEmail {
        return this.userEmail;
    }
    get UserGender(): UserGender {
        return this.userGender;
    }
    get UserRole(): UserRole {
        return this.userRole;
    }
    get UserPhoneNumber(): UserPhone {
        return this.userPhoneNumber;
    }


    protected constructor{
        
    }
}