import { Artist } from '../artist';
import { Result } from 'src/common/application/result-handler/result';
import { ArtistId } from '../value-objects/artist-id';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { AlbumId } from '../../../album/domain/value-objects/album-id';

export interface IArtistRepository {
  findArtistById(artistId: ArtistId): Promise<Result<Artist>>;

  findArtistBySongId(songId: SongId): Promise<Result<Artist[]>>;

  findTopArtists(): Promise<Result<Artist[]>>;

  findArtistsByName(name: string, limit?: number, offset?: number): Promise<Result<Artist[]>>

  findArtistByAlbumId(songId: AlbumId): Promise<Result<Artist[]>>;
}
