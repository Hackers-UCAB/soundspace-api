import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongPreviewUrlException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}