import { Playlist } from '../Playlist';
import { Result } from "src/common/application/result-handler/result";
import { PlaylistName } from '../value-objects/playlist-name';
import { PlaylistIdEntryApplicationDto } from '../../application/dto/entrys/playlist-id-entry.application.dto';

export interface IPlaylistRepository {
    findPlaylistById(id: PlaylistIdEntryApplicationDto): Promise<Result<PlaylistName>>;
    findTopPlaylist(): Promise<Result<Playlist[]>>;
}
