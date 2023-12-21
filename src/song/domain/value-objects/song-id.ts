
import { InvalidSongIdException } from "../exceptions/invalid-song-id.exception";
import { ValueObject } from '../../../common/domain/value-object';



export class SongId extends ValueObject<SongId>{
    private readonly id: string;

    constructor(id: string){
        let valid = true;
        if (!id) valid = false;
        if (!valid) {
            throw new InvalidSongIdException(`Id '${id}' not valid`);
        }
        super();
        this.id = id;
    }

    equals(obj: SongId): boolean {
        return this.id === obj.id;
    }

    get Id(): string {
        return this.id;    
    }

    static create(id: string): SongId {
        return new SongId(id);
    }
}