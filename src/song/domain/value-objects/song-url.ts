
import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongUrlException } from '../exceptions/invalid-song-url';

export class SongUrl extends ValueObject<SongUrl>{
    private readonly path: string;

    constructor(path: string){
        let valid = true;
        if (!path) valid = false;
        if (!valid) {
            throw new InvalidSongUrlException(`path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: SongUrl): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;    
    }

    static create(path: string): SongUrl {
        return new SongUrl(path);
    }
}