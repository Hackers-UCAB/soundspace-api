import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPlaylistNameException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}