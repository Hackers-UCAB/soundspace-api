import { ValueObject } from "src/common/domain/value-object";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { InvalidSubscriptionStatusException } from "../exceptions/invalid-subscription-status.exception";

export class SubscriptionStatus extends ValueObject<SubscriptionStatus>{

    private readonly status: SubscriptionStatusEnum;

    constructor(status: SubscriptionStatusEnum){
        let valid = true;
        if (!(status in SubscriptionStatusEnum)) valid = false

        if (!valid) {
            throw new InvalidSubscriptionStatusException(`Subscription status ${status} not valid`)
        }
        super();
        this.status = status;
    }

    get Status(): SubscriptionStatusEnum {
        return this.status
    }

    equals(obj: SubscriptionStatus): boolean {
        return this.status === obj.status
    }

    static create(status: SubscriptionStatusEnum): SubscriptionStatus {
        return new SubscriptionStatus(status)
    }
}