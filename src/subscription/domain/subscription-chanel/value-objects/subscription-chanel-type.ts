import { ValueObject } from "src/common/domain/value-object";
import { SubscriptionChanelTypeEnum } from "../enum/subscription-chanel-type.enum";
import { InvalidSubscriptionChanelTypeException } from "../exceptions/invalid-subscription-chanel-type.exception";


export class SubscriptionChanelType extends ValueObject<SubscriptionChanelType> {

    private readonly type: SubscriptionChanelTypeEnum;

    private constructor(type: SubscriptionChanelTypeEnum) {
        let valid: boolean = true;

        if(!Object.values(SubscriptionChanelTypeEnum).includes(type)){
            valid = false;
        }

        if(!valid){
            throw new InvalidSubscriptionChanelTypeException(`El tipo ${type} no es valido.`);
        }
        super();
        this.type = type;
    }

    get Type(){
        return this.type;
    }

    equals(obj: SubscriptionChanelType): boolean {
        return this.type === obj.type;
    }

    static create(type: SubscriptionChanelTypeEnum): SubscriptionChanelType {
        return new SubscriptionChanelType(type);
    }
}