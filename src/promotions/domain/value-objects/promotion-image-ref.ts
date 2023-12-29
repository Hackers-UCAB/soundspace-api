import { ValueObject } from "src/common/domain/value-object";
import { InvalidPromotionImageRefException } from "../exceptions/invalid-promotion-image-ref.exception";

export class PromotionImageRef extends ValueObject<PromotionImageRef>{

    private readonly path: string;

    constructor(path: string){
        let valid = true;
        if(!path) valid = false;
        if(!valid){
            throw new InvalidPromotionImageRefException(`path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: PromotionImageRef): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;
    }

    static create(path: string): PromotionImageRef {
        return new PromotionImageRef(path);
    }
}