import { Artist } from '../artist';
import { Result } from 'src/common/application/result-handler/result';
import { ArtistId } from '../value-objects/artist-id';

export interface IArtistRepository {

    findArtistById(artistId: ArtistId): Promise<Result<Artist>>;

    findTopArtists(): Promise<Result<Artist[]>>;

}