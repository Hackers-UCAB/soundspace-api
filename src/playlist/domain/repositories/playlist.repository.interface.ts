import { Playlist } from '../Playlist';
import { Result } from 'src/common/application/result-handler/result';
import { PlaylistId } from '../value-objects/playlist-id';

export interface IPlaylistRepository {
  findPlaylistById(
    GetPlaylistByIdEntryApplicationDto: PlaylistId,
  ): Promise<Result<Playlist>>;
  findTopPlaylist(): Promise<Result<Playlist[]>>;
}
