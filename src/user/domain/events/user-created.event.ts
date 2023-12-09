import { DomainEvent } from "src/common/domain/domain-event";
import { UserId } from "../value-objects/user-id";
import { UserPhone } from "../value-objects/user-phone";
import { UserRole } from "../value-objects/user-role";


export class UserCreated extends DomainEvent{

    protected constructor(
        public userId: UserId,
        public userPhoneNumber: UserPhone,
        public userRole: UserRole,
    ){
        super()
    }

    static create(
        userId: UserId,
        userPhoneNumber: UserPhone,
        userRole: UserRole,
    ): UserCreated{
        return new UserCreated(
            userId,
            userPhoneNumber,
            userRole
        )
    }
}
