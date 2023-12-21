import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongCoverException } from '../exceptions/invalid-song-cover.exception';



export class SongCover extends ValueObject<SongCover>{
    private readonly path: string;

    constructor(path: string){
        let valid = true;
        if (!path) valid = false;
        if (!valid) {
            throw new InvalidSongCoverException(`Path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: SongCover): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;    
    }

    static create(path: string): SongCover {
        return new SongCover(path);
    }
}