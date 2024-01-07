import { Result } from "src/common/application/result-handler/result";
import { SongId } from "../value-objects/song-id";
import { SongUrl } from "../value-objects/song-url";
import { Song } from "../song";
import { SongDuration } from "../value-objects/song-duration";


export interface PartialSong{
    name: SongUrl
    duration: SongDuration
}
export interface ISongRepository {
    findSongById(id: SongId): Promise<Result<Song>>
    findSongUrlById(id: string): Promise<Result<SongId>>
    findTopSongs(): Promise<Result<Song[]>>
    // findPartialSongById(id: string): Promise<Result<PartialSong>>
    findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>>
    findUrl(id: SongId): Promise<Result<PartialSong>>
    findPreview(id: SongId): Promise<Result<PartialSong>>
}