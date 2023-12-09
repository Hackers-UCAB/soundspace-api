import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}