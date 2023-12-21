import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongIdException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}