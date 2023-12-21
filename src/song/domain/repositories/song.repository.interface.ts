import { Result } from "src/common/application/result-handler/result";
import { SongId } from "../value-objects/song-id";
import { SongUrl } from "../value-objects/song-url";


  

export interface ISongRepository{

    findSongUrlById(id: string): Promise<Result<SongUrl>>
}