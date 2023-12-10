import { AggregateRoot } from "src/common/domain/aggregate-root";
import { UserId } from "src/user/domain/value-objects/user-id";
import { DomainEvent } from "src/common/domain/domain-event";
import { SubscriptionId } from './value-objects/subscription-id';
import { SubscriptionCreated } from "./events/subscription-created.event";
import { SubscriptionEndDate } from "./value-objects/subscription-end-date";
import { SubscriptionCreatedDate } from "./value-objects/subscription-created-date";
import { SubscriptionUpdated } from "./events/subscription-updated-event";
import { InvalidSubscriptionException } from "./exceptions/invalid-subscription.exception";
import { SubscriptionStatus } from "./value-objects/subscription-status";

export class Subscription extends AggregateRoot<SubscriptionId>{
    private  status: SubscriptionStatus
    private  createdOn: SubscriptionCreatedDate
    private  until: SubscriptionEndDate
    private  user: UserId

    get Status(): SubscriptionStatus {
        return this.status;
    }

    get CreatedOn(): SubscriptionCreatedDate {
        return this.createdOn;
    }

    get Until(): SubscriptionEndDate {
        return this.until
    }

    get User(): UserId {
        return this.user
    }

    protected constructor(
        id: SubscriptionId,
        status: SubscriptionStatus,
        createdOn: SubscriptionCreatedDate,
        until: SubscriptionEndDate,
        user: UserId
    ){
        const subscriptionCreated = SubscriptionCreated.create(
            id,
            status,
            createdOn,
            until,
            user    
        )
        super(id, subscriptionCreated)
    }


    protected when(event: DomainEvent): void {
        if (event instanceof SubscriptionCreated) {
            this.status = event.status
            this.createdOn = event.createdOn
            this.until = event.until
            this.user = event.user
        }

        if (event instanceof SubscriptionUpdated) {
            this.status = event.status
            this.createdOn = event.createdOn ? event.createdOn : this.createdOn
            this.until = event.until ? event.until : this.until
        }
    }
    protected ensureValidaState(): void {
        if (!this.status || !this.createdOn || !this.until || !this.user || !this.Id) {
            throw new InvalidSubscriptionException('Subscription not valid');
        }
    }

    public updateStatus(status: SubscriptionStatus, createdOn?: SubscriptionCreatedDate, until?: SubscriptionEndDate): void {
        this.apply(SubscriptionUpdated.create(this.Id, status, createdOn, until))
    }

    static create(
        id: SubscriptionId,
        status: SubscriptionStatus,
        createdOn: SubscriptionCreatedDate,
        until: SubscriptionEndDate,
        user: UserId
    ): Subscription{
        return new Subscription(
            id,
            status,
            createdOn,
            until,
            user
        )
    }
}