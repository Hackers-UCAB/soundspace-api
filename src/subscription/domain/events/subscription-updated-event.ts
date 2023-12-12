import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionCreatedDate } from "../value-objects/subscription-created-date";
import { SubscriptionEndDate } from "../value-objects/subscription-end-date";
import { SubscriptionStatus } from "../value-objects/subscription-status";

export class SubscriptionUpdated extends DomainEvent{

    protected constructor(
        public id: SubscriptionId,
        public status: SubscriptionStatus,
        public createdOn?: SubscriptionCreatedDate,
        public until?: SubscriptionEndDate,
    ){
        super()
    }

    static create(
        id: SubscriptionId,
        status: SubscriptionStatus,
        createdOn?: SubscriptionCreatedDate,
        until?: SubscriptionEndDate,
    ): SubscriptionUpdated{
        return new SubscriptionUpdated(
            id,
            status,
            createdOn,
            until
        )
    }
}
