import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionValueException } from "../exceptions/invalid-subscription-value.exception";


export class SubscriptionValue extends ValueObject<SubscriptionValue>{

    private readonly subscriptionValue: string;

    private constructor(subscriptionValue: string) {
        let valid: boolean = true;

        if (!subscriptionValue) valid = false;

        if (!valid) {
            throw new InvalidSubscriptionValueException('Subscription value not valid');
        }
        super();
        this.subscriptionValue = subscriptionValue;
    }

    get SubscriptionValue(){
        return this.subscriptionValue;
    }

    equals(obj: SubscriptionValue): boolean {
        return this.subscriptionValue === obj.subscriptionValue;
    }

    static create(subscriptionValue: string): SubscriptionValue {
        return new SubscriptionValue(subscriptionValue);
    }
}