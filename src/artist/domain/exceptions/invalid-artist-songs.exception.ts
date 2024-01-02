import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistSongsException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}