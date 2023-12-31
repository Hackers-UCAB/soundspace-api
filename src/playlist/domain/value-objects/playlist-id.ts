import { InvalidPlaylistIdException } from "../exceptions/invalid-playlist-id.exception";
import { ValueObject } from '../../../common/domain/value-object';

export class PlaylistId extends ValueObject<PlaylistId>{
    private readonly id: string;

    constructor(id: string) {
        let valid = true;
        if (!id) valid = false;
        if (!valid) {
            throw new InvalidPlaylistIdException(`Id '${id}' not valid`);
        }
        super();
        this.id = id;
    }

    equals(obj: PlaylistId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): PlaylistId {
        return new PlaylistId(id);
    }
}
