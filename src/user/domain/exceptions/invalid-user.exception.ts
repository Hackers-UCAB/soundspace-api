import { DomainException } from "src/common/domain/domain-exception";

export class InvalidUserException extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}