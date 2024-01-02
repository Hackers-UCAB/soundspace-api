import { ValueObject } from '../../../common/domain/value-object';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidPlaylistSongException } from '../exceptions/invalid-playlist-songs.exception';

export class PlaylistSong extends ValueObject<PlaylistSong>{
    private readonly songs: SongId[];

    constructor(songs: SongId[]) {
        let valid = true;
        if (!songs) valid = false;
        if (!valid) {
            throw new InvalidPlaylistSongException(`Id '${songs}' not valid`);
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