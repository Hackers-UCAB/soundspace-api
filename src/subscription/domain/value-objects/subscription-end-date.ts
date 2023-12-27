import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionEndDate } from "../exceptions/invalid-subscription-end-date.exception";

export class SubscriptionEndDate extends ValueObject<SubscriptionEndDate>{

    private readonly until: Date;

    constructor(until: Date){
        let valid = true;
        const today = new Date().setHours(0, 0, 0, 0);
        const untilDate = new Date(until).setHours(0, 0, 0, 0);
        
        if (!(untilDate >= today)) valid = false;

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

    static create(until: Date): SubscriptionEndDate {
        return new SubscriptionEndDate(until);
    }
}