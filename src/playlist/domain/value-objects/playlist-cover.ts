import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPlaylistCoverException } from '../exceptions/invalid-Playlist-cover.exception';

export class PlaylistCover extends ValueObject<PlaylistCover>{
    private readonly path: string;

    constructor(path: string) {
        let valid = true;
        if (!path) valid = false;
        if (!valid) {
            throw new InvalidPlaylistCoverException(`Path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: PlaylistCover): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;
    }

    static create(path: string): PlaylistCover {
        return new PlaylistCover(path);
    }
}