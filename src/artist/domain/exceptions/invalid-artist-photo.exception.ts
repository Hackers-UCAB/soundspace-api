import { DomainException } from "src/common/domain/domain-exception";

export class InvalidArtistPhotoException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}