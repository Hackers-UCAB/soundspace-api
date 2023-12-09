import { ValueObject } from "src/common/domain/value-object";
import { SubscriptionCreatedDate } from "./subscription-created-date";
import { InvalidSubscriptionEndDate } from "../exceptions/invalid-subscription-end-date.exception";

export class SubscriptionEndDate extends ValueObject<SubscriptionEndDate>{

    private readonly until: Date;

    constructor(until: Date){
        let valid = true;
        const today = new Date();
        if (!(until >= today)) valid = false;

        if (!valid) {
            throw new InvalidSubscriptionEndDate(`Subscription end date ${until} not valid`);
        }
        super();
        this.until = until;
    }

  
    equals(obj: SubscriptionEndDate): boolean {
        return this.until === obj.until;
    }

    get Date(): Date {
        return this.until
    }

    static create(until: Date): SubscriptionCreatedDate {
        return new SubscriptionCreatedDate(until);
    }
}