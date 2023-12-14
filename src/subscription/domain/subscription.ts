import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { DomainEvent } from 'src/common/domain/domain-event';
import { SubscriptionId } from './value-objects/subscription-id';
import { SubscriptionCreated } from './events/subscription-created.event';
import { SubscriptionEndDate } from './value-objects/subscription-end-date';
import { SubscriptionCreatedDate } from './value-objects/subscription-created-date';
import { SubscriptionUpdated } from './events/subscription-updated-event';
import { InvalidSubscriptionException } from './exceptions/invalid-subscription.exception';
import { SubscriptionStatus } from './value-objects/subscription-status';
import { SubscriptionValue } from './value-objects/subscription-value';
import { SubscriptionExpired } from './events/subscription-expired.event';
import { SubscriptionStatusEnum } from './enums/subscription-status.enum';

export class Subscription extends AggregateRoot<SubscriptionId> {
  private status: SubscriptionStatus;
  private createdOn: SubscriptionCreatedDate;
  private until: SubscriptionEndDate;
  private subscriptionValue: SubscriptionValue;
  private user: UserId;

  get Status(): SubscriptionStatus {
    return this.status;
  }

  get CreatedOn(): SubscriptionCreatedDate {
    return this.createdOn;
  }

  get Until(): SubscriptionEndDate {
    return this.until;
  }

  get SubscriptionValue(): SubscriptionValue {
    return this.subscriptionValue;
  }

  get User(): UserId {
    return this.user;
  }

  protected constructor(
    id: SubscriptionId,
    status: SubscriptionStatus,
    createdOn: SubscriptionCreatedDate,
    until: SubscriptionEndDate,
    value: SubscriptionValue,
    user: UserId,
  ) {
  
    const subscriptionCreated = SubscriptionCreated.create(
      id,
      status,
      createdOn,
      until,
      value,
      user,
    );
    super(id, subscriptionCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof SubscriptionCreated) {
      this.status = event.status;
      this.createdOn = event.createdOn;
      this.until = event.until;
      this.user = event.user;
      this.subscriptionValue = event.value;
    }

    if (event instanceof SubscriptionUpdated) {
      this.status = event.status;
      this.createdOn = event.createdOn ? event.createdOn : this.createdOn;
      this.until = event.until ? event.until : this.until;
    }

    if (event instanceof SubscriptionExpired){
      this.status = event.status
  }
  }

  protected ensureValidaState(): void {
    if (
      !this.status ||
      !this.createdOn ||
      !this.until ||
      !this.user ||
      !this.Id  ||
      !this.subscriptionValue
    ) {
      throw new InvalidSubscriptionException('Subscription not valid');
    }
  }

  public updateStatus(
    status: SubscriptionStatus,
    createdOn?: SubscriptionCreatedDate,
    until?: SubscriptionEndDate,
  ): void {
    this.apply(SubscriptionUpdated.create(this.Id, status, createdOn, until));
  }

  public expireSubscription(){
    this.apply(SubscriptionExpired.create(this.Id, this.user, SubscriptionStatus.create(SubscriptionStatusEnum.EXPIRED)));
}

  static calculateEndDate(
    createdOn: SubscriptionCreatedDate,
  ): SubscriptionEndDate {
    const endDate = createdOn.Date;
    endDate.setDate(createdOn.Date.getDate() + 30);
    return SubscriptionEndDate.create(endDate);
  }

  static async create(
    id: SubscriptionId,
    status: SubscriptionStatus,
    createdOn: SubscriptionCreatedDate,
    until: SubscriptionEndDate,
    value: SubscriptionValue,
    user: UserId,
  ): Promise<Subscription> {
    return new Subscription(id, status, createdOn, until, value, user);
  }
}
