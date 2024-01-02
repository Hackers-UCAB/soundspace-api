import { DomainException } from "src/common/domain/domain-exception";

export class InvalidPlaylistSongException extends DomainException {
    constructor(message: string) {
        super(message);
    }
}