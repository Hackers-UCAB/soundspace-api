import { DomainException } from "src/common/domain/domain-exception";


export class InvalidPromotionException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}