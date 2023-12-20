
import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongPreviewUrlException } from '../exceptions/invalid-song-preview-url.exception';



export class SongPreviewUrl extends ValueObject<SongPreviewUrl>{
    private readonly path: string;

    constructor(path: string){
        let valid = true;
        if (!path) valid = false;
        if (!valid) {
            throw new InvalidSongPreviewUrlException(`path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: SongPreviewUrl): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;    
    }

    static create(path: string): SongPreviewUrl {
        return new SongPreviewUrl(path);
    }
}