import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionStatus } from "../value-objects/subscription-status";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";



export class SubscriptionNearToExpired extends DomainEvent {
    constructor(
        public id: SubscriptionId,
        public user: UserId,
        public status: SubscriptionStatus,
        public chanel: SubscriptionChanelId
    ) {
        super();
    }

    static create(
        id: SubscriptionId,
        user: UserId,
        status: SubscriptionStatus,
        chanel: SubscriptionChanelId
    ): SubscriptionNearToExpired {
        return new SubscriptionNearToExpired(
            id,
            user,
            status,
            chanel
        );
    }
}