import { ValueObject } from "src/common/domain/value-object";
import { InvalidArtistIdException } from "../exceptions/invalid-artist-id.exception";

export class ArtistId extends ValueObject<ArtistId> {

    private readonly id: string;

    constructor(id: string) {
        let valid = true;
        if (!id) valid = false;
        if (!valid) {
            throw new InvalidArtistIdException(`id '${id}' not valid`);
        }
        super();
        this.id = id;
    }

    equals(obj: ArtistId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;
    }

    static create(id: string): ArtistId {
        return new ArtistId(id);
    }
    
}