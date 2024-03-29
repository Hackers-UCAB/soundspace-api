import { Playlist } from '../playlist';
import { Result } from 'src/common/domain/result-handler/result';
import { PlaylistId } from '../value-objects/playlist-id';

export interface IPlaylistRepository {
  findPlaylistById(playlistId: PlaylistId): Promise<Result<Playlist>>;
  findTopPlaylist(): Promise<Result<Playlist[]>>;
  findPlaylistsByName(name: string, limit?: number, offset?: number): Promise<Result<Playlist []>>
}
