import { DomainEvent } from "src/common/domain/domain-event";
import { UserId } from "../value-objects/user-id";
import { UserRole } from "../value-objects/user-role";


export class UserChangedToGuest extends DomainEvent {
    protected constructor(
        public id: UserId,
        public userRole: UserRole
    ){
        super()
    }

    static create(
        id: UserId,
        userRole: UserRole
    ){
        return new UserChangedToGuest(
            id,
            userRole
        )
    }
}