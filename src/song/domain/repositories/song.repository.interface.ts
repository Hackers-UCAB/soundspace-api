import { Result } from "src/common/application/result-handler/result";
import { SongId } from "../value-objects/song-id";
import { Song } from "../song";

export interface ISongRepository {
    findSongById(id: SongId): Promise<Result<Song>>
    findSongUrlById(id: string): Promise<Result<SongId>>
    findTopSongs(): Promise<Result<Song[]>>
}