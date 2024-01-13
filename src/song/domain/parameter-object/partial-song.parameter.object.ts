import { SongDuration } from "../value-objects/song-duration"
import { SongUrl } from "../value-objects/song-url"

export interface PartialSong{
    name: SongUrl
    duration: SongDuration
}