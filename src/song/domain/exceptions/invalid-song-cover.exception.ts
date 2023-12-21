import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongCoverException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}