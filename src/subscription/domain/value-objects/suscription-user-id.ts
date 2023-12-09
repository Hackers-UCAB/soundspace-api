import { ValueObject } from "src/common/domain/value-object";
import { UserId } from "src/user/domain/value-objects/user-id";
import { InvalidSubscriptionUserId } from "../exceptions/invalid-subscription-user-id.exception";

export class SubscriptionUserId extends ValueObject<SubscriptionUserId> {
    private readonly id: UserId;

    constructor (id: UserId) {
        let valid = true;
        if(!id) valid = false;
        
        if(!valid) {
            throw new InvalidSubscriptionUserId(`Id '${id}' not valid`);
        }
        super()
        this.id = id
    }

    equals(obj: SubscriptionUserId): boolean {
        return this.id === obj.id;
    }

    get Id(): UserId {
        return this.id;
    }

    static create(id: UserId): SubscriptionUserId {
        return new SubscriptionUserId(id);
    }
}