import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionStatusException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}