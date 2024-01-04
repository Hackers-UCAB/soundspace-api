import { DomainEvent } from "src/common/domain/domain-event";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionStatus } from "../value-objects/subscription-status";


export class SubscriptionCanceled extends DomainEvent {
    protected constructor(
        public id: SubscriptionId,
        public userId: UserId,
        public status: SubscriptionStatus,
        public chanel: SubscriptionChanelId
    ){
        super();
    }

    static create(
        id: SubscriptionId,
        userId: UserId,
        status: SubscriptionStatus,
        chanel: SubscriptionChanelId
    ): SubscriptionCanceled{
        return new SubscriptionCanceled(
            id,
            userId, 
            status,
            chanel
        )
    }
}