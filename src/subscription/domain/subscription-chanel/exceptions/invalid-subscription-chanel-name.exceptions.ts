import { DomainException } from "src/common/domain/domain-exception";


export class InvalidSubscriptionChanelNameException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}