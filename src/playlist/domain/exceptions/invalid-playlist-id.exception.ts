import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPlaylistIdException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}
