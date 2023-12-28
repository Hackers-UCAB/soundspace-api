import { ValueObject } from '../../../common/domain/value-object';
import { InvalidPlaylistNameException } from '../exceptions/invalid-playlist-name.exception';



export class PlaylistName extends ValueObject<PlaylistName>{
    private readonly name: string;

    constructor(name: string) {
        let valid = true;
        if (!name) valid = false;
        if (!valid) {
            throw new InvalidPlaylistNameException(`name '${name}' not valid`);
        }
        super();
        this.name = name;
    }

    equals(obj: PlaylistName): boolean {
        return this.name === obj.name;
    }

    get Name(): string {
        return this.name;
    }

    static create(name: string): PlaylistName {
        return new PlaylistName(name);
    }
}