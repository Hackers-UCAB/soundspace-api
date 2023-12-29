import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongGenreException } from '../exceptions/invalid-song-genre.exception';
    export class SongGenres extends ValueObject<SongGenres>{
    private readonly genres: string[];

    constructor(genre: string[]) {
        let valid = true;
        if (!genre && genre.length == 0) valid = false;
        if (!valid) {
            throw new InvalidSongGenreException(`genre '${genre}' not valid`);
        }
        super();
        this.genres = genre;
    }

    equals(obj: SongGenres): boolean {
        return this.genres === obj.genres;
    }

    get Genre(): string[] {
        return this.genres;
    }

    static create(genre: string[]): SongGenres {
        return new SongGenres(genre);
    }
}
