import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongNameException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}