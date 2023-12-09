import { ValueObject } from "src/common/domain/value-object";

export class SubscriptionCreatedDate extends ValueObject<SubscriptionCreatedDate>{

    private readonly createdOn: Date;

    constructor(createdOn: Date){
        super();
        this.createdOn = createdOn;
    }

    equals(obj: SubscriptionCreatedDate): boolean {
        return this.createdOn === obj.createdOn;
    }

    get Date(): Date {
        return this.createdOn
    }

    static create(createdOn: Date): SubscriptionCreatedDate {
        return new SubscriptionCreatedDate(createdOn);
    }
}