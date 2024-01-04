import { Result } from "src/common/application/result-handler/result";
import { SongId } from "../value-objects/song-id";
import { SongUrl } from "../value-objects/song-url";
import { Song } from "../song";


export interface PartialSong{
    name: string
    duration: number
}


export interface ISongRepository {
    findSongById(id: SongId): Promise<Result<Song>>
    findSongUrlById(id: string): Promise<Result<SongId>>
    findPartialSongById(id: string): Promise<Result<PartialSong>>
    findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>>
}