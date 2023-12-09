import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionEndDate extends DomainException {
    constructor (message: string) {
        super(message);
    }
}