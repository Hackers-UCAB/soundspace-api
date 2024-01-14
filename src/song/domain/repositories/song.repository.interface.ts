import { Result } from "src/common/domain/result-handler/result";
import { SongId } from "../value-objects/song-id";
import { Song } from "../song";
import { PartialSong } from "../parameter-object/partial-song.parameter.object";

export interface ISongRepository {
    findSongById(id: SongId): Promise<Result<Song>>
    findSongUrlById(id: string): Promise<Result<SongId>>
    findTopSongs(): Promise<Result<Song[]>>
    // findPartialSongById(id: string): Promise<Result<PartialSong>>
    findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>>
    findUrl(id: SongId): Promise<Result<PartialSong>>
    findPreview(id: SongId): Promise<Result<PartialSong>>
}