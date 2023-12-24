import { Playlist } from '../Playlist';
import { Result } from "src/common/application/result-handler/result";
import { PlaylistName } from '../value-objects/playlist-name';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';

export interface IPlaylistRepository {
    findPlaylistById(GetPlaylistByIdEntryApplicationDto: GetPlaylistByIdEntryApplicationDto): Promise<Result<PlaylistName>>;
    findTopPlaylist(): Promise<Result<Playlist[]>>;
}
