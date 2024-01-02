import { ValueObject } from "src/common/domain/value-object";
import { InvalidArtistNameException } from "../exceptions/invalid-artist-name.exception";

export class ArtistName extends ValueObject<ArtistName> {

    private readonly name: string;

    constructor(name: string) {
        let valid = true;
        if (!name) valid = false;
        if (!valid) {
            throw new InvalidArtistNameException(`name '${name}' not valid`);
        }
        super();
        this.name = name;
    }

    equals(obj: ArtistName): boolean {
        return this.name === obj.name;
    }

    get Name(): string {
        return this.name;
    }

    static create(name: string): ArtistName {
        return new ArtistName(name);
    }
    
}