import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionCreatedDate } from "../value-objects/subscription-created-date";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionEndDate } from '../value-objects/subscription-end-date';
import { SubscriptionStatus } from "../value-objects/subscription-status";


export class SubscriptionCreated extends DomainEvent{

    protected constructor(
        public id: SubscriptionId,
        public status: SubscriptionStatus,
        public createdOn: SubscriptionCreatedDate,
        public until: SubscriptionEndDate,
        public user: UserId
    ){
        super()
    }

    static create(
        id: SubscriptionId,
        status: SubscriptionStatus,
        createdOn: SubscriptionCreatedDate,
        until: SubscriptionEndDate,
        user: UserId
    ): SubscriptionCreated{
        return new SubscriptionCreated(
            id,
            status,
            createdOn,
            until,
            user
        )
    }
}
