import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistNameException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}