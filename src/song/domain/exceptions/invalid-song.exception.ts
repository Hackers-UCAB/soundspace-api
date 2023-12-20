import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}