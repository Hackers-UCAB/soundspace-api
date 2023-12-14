import { DomainException } from "src/common/domain/domain-exception";


export class InvalidSubscriptionChanelTypeException extends DomainException{

    constructor(msg: string){
        super(msg);
    }
}