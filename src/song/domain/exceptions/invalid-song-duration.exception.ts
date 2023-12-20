import { DomainException } from "src/common/domain/domain-exception";

export class InvalidSongDurationException extends DomainException {
    constructor (message: string) {
        super(message);
    }
}