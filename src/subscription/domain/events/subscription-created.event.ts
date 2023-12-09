import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { SubscriptionCreatedDate } from "../value-objects/subscription-created-date";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionEndDate } from '../value-objects/subscription-end-date';


export class SubscriptionCreated extends DomainEvent{

    protected constructor(
        public id: SubscriptionId,
        public status: SubscriptionStatusEnum,
        public createdOn: SubscriptionCreatedDate,
        public until: SubscriptionEndDate,
        public user: UserId
    ){
        super()
    }

    static create(
        id: SubscriptionId,
        status: SubscriptionStatusEnum,
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
