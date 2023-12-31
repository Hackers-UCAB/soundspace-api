import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistAlbumsException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}