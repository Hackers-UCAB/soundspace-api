import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionIdException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}