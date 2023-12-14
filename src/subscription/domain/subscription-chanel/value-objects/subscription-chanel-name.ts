import { ValueObject } from "src/common/domain/value-object";
import { InvalidSubscriptionChanelNameException } from "../exceptions/invalid-subscription-chanel-name.exceptions";

export class SubscriptionChanelName extends ValueObject<SubscriptionChanelName> {
    private readonly name: string;

    private constructor(name: string) {
        let valid: boolean = true;
        if (!name) throw new InvalidSubscriptionChanelNameException(`El nombre ${name} no existe`);

        //El nombre debe ser mayor a 3 y menor a 50
        if ((name.length < 3) || (name.length > 50 )) {
            valid = false;
        }

        if(!valid){
            throw new InvalidSubscriptionChanelNameException(`El nombre ${name} no es valido.`);
        }
        super();
        this.name = name;
    }

    get Name(){
        return this.name;
    }

    equals(obj: SubscriptionChanelName): boolean {
        return this.name === obj.name;
    }

    static create(name: string): SubscriptionChanelName {
        return new SubscriptionChanelName(name);
    }
}