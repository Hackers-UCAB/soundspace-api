import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionChanelIdException } from "../exceptions/invalid-subscription-chanel-id.exception";


export class SubscriptionChanelId extends ValueObject<SubscriptionChanelId>{

    private readonly id: string;

    constructor(id: string){
        let valid = true;
        if(!id) valid = false;
        if(!valid) {
            throw new InvalidSubscriptionChanelIdException(`Id '${id}' not valid`);
        }
        super()
        this.id = id
    }

    equals(obj: SubscriptionChanelId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): SubscriptionChanelId {
        return new SubscriptionChanelId(id);
    }
}