import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPlaylistCoverException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}