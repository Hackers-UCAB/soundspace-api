import { ValueObject } from "src/common/domain/value-object";
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidArtistSongsException } from "../exceptions/invalid-artist-songs.exception";

export class ArtistSongs extends ValueObject<ArtistSongs> {

    private readonly songs: SongId[];

    constructor(songs: SongId[]) {
        let valid = true;
        if (!songs) valid = false;
        if (!valid) {
            throw new InvalidArtistSongsException(`songs '${songs}' not valid`);
        }
        super();
        this.songs = songs;
    }

    equals(obj: ArtistSongs): boolean {
        return this.songs === obj.songs;
    }

    get Songs(): SongId[] {
        return this.songs;
    }

    static create(songs: SongId[]): ArtistSongs {
        return new ArtistSongs(songs);
    }
    
}