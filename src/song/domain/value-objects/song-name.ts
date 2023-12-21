
import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongNameException } from '../exceptions/invalid-song-name.exception';



export class SongName extends ValueObject<SongName>{
    private readonly name: string;

    constructor(name: string){
        let valid = true;
        if (!name) valid = false;
        if (!valid) {
            throw new InvalidSongNameException(`name '${name}' not valid`);
        }
        super();
        this.name = name;
    }

    equals(obj: SongName): boolean {
        return this.name === obj.name;
    }

    get Name(): string {
        return this.name;    
    }

    static create(name: string): SongName {
        return new SongName(name);
    }
}