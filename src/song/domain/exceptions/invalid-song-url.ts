import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongUrlException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}