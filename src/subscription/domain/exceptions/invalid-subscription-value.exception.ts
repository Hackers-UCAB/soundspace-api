import { DomainException } from "src/common/domain/domain-exception";


export class InvalidSubscriptionValueException extends DomainException{

    constructor (message: string) {
        super(message);
    }
}