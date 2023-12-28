import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPromotionImageRefException extends DomainException {
    constructor(msg: string){
        super(msg);
    }
}