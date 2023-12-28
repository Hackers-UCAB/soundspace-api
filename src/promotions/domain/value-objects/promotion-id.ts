import { ValueObject } from "src/common/domain/value-object";
import { InvalidPromotionIdException } from "../exceptions/invalid-promotion-id.exception";


export class PromotionId extends ValueObject<PromotionId> {
    private readonly id: string;
    constructor(id: string){
        let valid = true;
        if(!id) valid = false;
        if(!valid) {
            throw new InvalidPromotionIdException(`Id '${id}' not valid`);
        }
        super();
        this.id = id;
    }

    equals(obj: PromotionId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): PromotionId {
        return new PromotionId(id);
    }
}