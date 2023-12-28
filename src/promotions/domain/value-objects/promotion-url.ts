import { ValueObject } from "src/common/domain/value-object";
import { InvalidPromotionUrlException } from "../exceptions/invalid-promotion-url.exception";

export class PromotionUrl extends ValueObject<PromotionUrl>{

    private readonly path: string;

    constructor(path: string){
        let valid = true;
        if(!path) valid = false;
        if(!valid){
            throw new InvalidPromotionUrlException(`path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: PromotionUrl): boolean {
        return this.path === obj.path;
    }
    
    get Path(): string {
        return this.path;
    }

    static create(path: string): PromotionUrl {
        return new PromotionUrl(path);
    }
}