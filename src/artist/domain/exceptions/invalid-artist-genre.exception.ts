import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistGenreException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}