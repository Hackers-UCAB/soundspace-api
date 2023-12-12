import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionChanelIdException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}