import { DomainEvent } from "src/common/domain/domain-event";
import { UserId } from "../value-objects/user-id";
import { UserPhone } from "../value-objects/user-phone";
import { UserRole } from "../value-objects/user-role";
import { UserName } from "../value-objects/user-name";
import { UserBirthday } from "../value-objects/user-birthday";
import { UserEmail } from "../value-objects/user-email";
import { UserGender } from "../value-objects/user-gender";


export class UserCreated extends DomainEvent{

    protected constructor(
        public userId: UserId,
        public userRole: UserRole,
        public userPhoneNumber?: UserPhone,
        public userName?: UserName,
        public userBirthday?: UserBirthday,
        public userEmail?: UserEmail,
        public userGender?: UserGender
    ){
        super()
    }

    static create(
        userId: UserId,
        userPhoneNumber: UserPhone,
        userRole: UserRole,
        userName?: UserName,
        userBirthday?: UserBirthday,
        userEmail?: UserEmail,
        userGender?: UserGender
    ): UserCreated{
        return new UserCreated(
            userId,
            userRole,
            userPhoneNumber,
            userName,
            userBirthday,
            userEmail,
            userGender  
        )
    }
}
