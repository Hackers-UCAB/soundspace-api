import { DomainEvent } from "src/common/domain/domain-event";
import { UserId } from "../value-objects/user-id";
import { UserName } from "../value-objects/user-name";


export class UserNameModified extends DomainEvent {
    protected constructor(
        public id: UserId,
        public name: UserName
    ){
        super()
    }

    static create(
        id: UserId,
        name: UserName
    ){
        return new UserNameModified(
            id,
            name
        )
    }
}