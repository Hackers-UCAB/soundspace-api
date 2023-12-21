import { ValueObject } from '../../../common/domain/value-object';

import { InvalidSongDurationException } from "../exceptions/invalid-song-duration.exception";
export class SongDuration extends ValueObject<SongDuration>{
    private readonly duration: number;

    constructor(duration: number){
        let valid = true;
        if (!duration) valid = false;
        if (!valid) {
            throw new InvalidSongDurationException(`duration '${duration}' not valid`);
        }
        super();
        this.duration = duration;
    }

    equals(obj: SongDuration): boolean {
        return this.duration === obj.duration;
    }

    get Duration(): number {
        return this.duration;    
    }

    static create(duration: number): SongDuration {
        return new SongDuration(duration);
    }
}