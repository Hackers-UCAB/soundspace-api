import { Artist } from '../artist';
import { Result } from 'src/common/application/result-handler/result';
import { ArtistId } from '../value-objects/artist-id';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { AlbumId } from 'src/album/domain/value-objects/album-id';

export interface IArtistRepository {

    findArtistById(artistId: ArtistId): Promise<Result<Artist>>;

    //Deprecado...
    findSingleArtistBySongId(songId: SongId): Promise<Result<Artist>>;

    findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>>;

    findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>>;

    findTrendingArtists(): Promise<Result<Artist[]>>;

    findArtistsByName(name: string, limit?: number, offset?: number): Promise<Result<Artist[]>>

}