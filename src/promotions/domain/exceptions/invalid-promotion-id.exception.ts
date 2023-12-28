import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPromotionIdException extends DomainException {
    constructor(msg: string) {
        super(msg);
    }
}