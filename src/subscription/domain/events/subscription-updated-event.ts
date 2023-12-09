import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { SubscriptionCreatedDate } from "../value-objects/subscription-created-date";
import { SubscriptionEndDate } from "../value-objects/subscription-end-date";

export class SubscriptionUpdated extends DomainEvent{

    protected constructor(
        public id: SubscriptionId,
        public status: SubscriptionStatusEnum,
        public createdOn?: SubscriptionCreatedDate,
        public until?: SubscriptionEndDate,
    ){
        super()
    }

    static create(
        id: SubscriptionId,
        status: SubscriptionStatusEnum,
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
