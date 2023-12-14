import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionChanelUrlValidationException } from "../exceptions/invalid-subscription-chanel-url-validation.exception";

export class SubscriptionChanelUrlValidation extends ValueObject<SubscriptionChanelUrlValidation> {
    private readonly url: string;

    private constructor(url: string) {
        let valid: boolean = true;
        if (!url) valid = false;
       
        if(!valid){
            throw new InvalidSubscriptionChanelUrlValidationException(`El url ${url} no es valido.`);
        }
        super();
        this.url = url;
    }

    get Url(){
        return this.url;
    }

    equals(obj: SubscriptionChanelUrlValidation): boolean {
        return this.url === obj.url;
    }

    static create(name: string): SubscriptionChanelUrlValidation {
        return new SubscriptionChanelUrlValidation(name);
    }
}