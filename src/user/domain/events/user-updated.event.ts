import { DomainEvent } from "src/common/domain/domain-event";
import { UserBirthday } from "../value-objects/user-birthday";
import { UserEmail } from '../value-objects/user-email';
import { UserGender } from "../value-objects/user-gender";
import { UserPhone } from "../value-objects/user-phone";
import { UserId } from '../value-objects/user-id';
import { UserName } from "../value-objects/user-name";


export class UserUpdated extends DomainEvent{

    constructor(
        public id: UserId,
        public name?: UserName,
        public birthday?: UserBirthday,
        public email?: UserEmail,
        public gender?: UserGender,
    ) {
        super();
    }

    static create(
        id: UserId,
        name?: UserName,
        birthday?: UserBirthday,
        email?: UserEmail,
        gender?: UserGender,
    ): UserUpdated{
        return new UserUpdated(id, name, birthday, email, gender);
    }
}