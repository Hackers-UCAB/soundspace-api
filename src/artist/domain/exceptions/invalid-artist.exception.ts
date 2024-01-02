import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}