import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongGenreException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}