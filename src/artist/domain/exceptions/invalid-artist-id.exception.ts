import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistIdException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}