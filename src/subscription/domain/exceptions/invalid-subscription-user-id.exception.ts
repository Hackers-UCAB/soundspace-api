import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSubscriptionUserId extends DomainException {
    constructor (message: string) {
        super(message);
    }
}