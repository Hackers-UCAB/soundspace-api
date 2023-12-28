import { ValueObject } from '../../../common/domain/value-object';
import { InvalidSongIdException } from '../../../song/domain/exceptions/invalid-song-id.exception';
import { SongId } from '../../../song/domain/value-objects/song-id';

export class PlaylistSong extends ValueObject<PlaylistSong>{
    private readonly songs: SongId[];

    constructor(songs: SongId[]) {
        let valid = true;
        if (!songs) valid = false;
        if (!valid) {
            throw new InvalidSongIdException(`Id '${songs}' not valid`);
        }
        super();
        this.songs = songs;
    }

    equals(obj: PlaylistSong): boolean {
        return this.songs === obj.songs;
    }

    get Songs(): SongId[] {
        return this.songs;
    }

    static create(songs: SongId[]): PlaylistSong {
        return new PlaylistSong(songs);
    }
}