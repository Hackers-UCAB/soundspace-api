import { ValueObject } from "src/common/domain/value-object";
import { InvalidArtistPhotoException } from "../exceptions/invalid-artist-photo.exception";

export class ArtistPhoto extends ValueObject<ArtistPhoto> {

    private readonly path: string;

    constructor(path: string) {
        let valid = true;
        if (!path) valid = false;
        if (!valid) {
            throw new InvalidArtistPhotoException(`path '${path}' not valid`);
        }
        super();
        this.path = path;
    }

    equals(obj: ArtistPhoto): boolean {
        return this.path === obj.path;
    }

    get Path(): string {
        return this.path;
    }

    static create(path: string): ArtistPhoto {
        return new ArtistPhoto(path);
    }
    
}