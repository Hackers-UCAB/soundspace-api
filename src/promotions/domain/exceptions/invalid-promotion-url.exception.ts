import { DomainException } from "src/common/domain/domain-exception";


export class InvalidPromotionUrlException extends DomainException {
    constructor(msg: string){
        super(msg);
    }
}