import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongGenreException } from '../exceptions/invalid-song-genre.exception';

export class SongGenre extends ValueObject<SongGenre>{
    private readonly genre: string;

    constructor(genre: string){
        let valid = true;
        if (!genre) valid = false;
        if (!valid) {
            throw new InvalidSongGenreException(`genre '${genre}' not valid`);
        }
        super();
        this.genre = genre;
    }

    equals(obj: SongGenre): boolean {
        return this.genre === obj.genre;
    }

    get Genre(): string {
        return this.genre;    
    }

    static create(genre: string): SongGenre {
        return new SongGenre(genre);
    }
}