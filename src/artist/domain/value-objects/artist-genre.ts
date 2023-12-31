import { ValueObject } from "src/common/domain/value-object";
import { InvalidArtistGenreException } from "../exceptions/invalid-artist-genre.exception";

export class ArtistGenre extends ValueObject<ArtistGenre> {

    private readonly genre: string;

    constructor(genre: string) {
        let valid = true;
        if (!genre) valid = false;
        if (!valid) {
            throw new InvalidArtistGenreException(`genre '${genre}' not valid`);
        }
        super();
        this.genre = genre;
    }

    equals(obj: ArtistGenre): boolean {
        return this.genre === obj.genre;
    }

    get Genre(): string {
        return this.genre;
    }

    static create(genre: string): ArtistGenre {
        return new ArtistGenre(genre);
    }
    
}