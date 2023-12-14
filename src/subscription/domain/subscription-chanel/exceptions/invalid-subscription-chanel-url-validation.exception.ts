import { DomainException } from "src/common/domain/domain-exception";


export class InvalidSubscriptionChanelUrlValidationException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}