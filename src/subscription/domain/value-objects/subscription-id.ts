import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionIdException } from "../exceptions/invalid-subscription-id.exception";


export class SubscriptionId extends ValueObject<SubscriptionId>{

    private readonly id: string;

    constructor(id: string){
        let valid = true;
        if(id) valid = false;

        if(!valid) {
            throw new InvalidSubscriptionIdException(`Id '${id}' not valid`);
        }
        super()
        this.id = id
    }

    equals(obj: SubscriptionId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): SubscriptionId {
        return new SubscriptionId(id);
    }
}