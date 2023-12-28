import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionStatus } from "../value-objects/subscription-status";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";

export class SubscriptionExpired extends DomainEvent{
    protected constructor(
        public id: SubscriptionId,
        public userId: UserId,
        public status: SubscriptionStatus,
        public chanel: SubscriptionChanelId
    ){
        super()
    }

    static create(
        id: SubscriptionId,
        userId: UserId,
        status: SubscriptionStatus,
        chanel: SubscriptionChanelId
    ): SubscriptionExpired{
        return new SubscriptionExpired(
            id,
            userId, 
            status,
            chanel
        )
    }
}