import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPlaylistException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}