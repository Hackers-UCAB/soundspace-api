import { Playlist } from '../Playlist';
import { Result } from "src/common/application/result-handler/result";
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';
import { PlaylistResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';

export interface IPlaylistRepository {
    findPlaylistById(GetPlaylistByIdEntryApplicationDto: GetPlaylistByIdEntryApplicationDto): Promise<Result<PlaylistResponseApplicationDto>>;
    findTopPlaylist(): Promise<Result<Playlist[]>>;
}
