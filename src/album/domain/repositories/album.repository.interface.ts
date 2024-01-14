import { Album } from '../album';
import { Result } from 'src/common/domain/result-handler/result';
import { AlbumId } from '../value-objects/album-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';

export interface IAlbumRepository {
  findAlbumById(albumId: AlbumId): Promise<Result<Album>>;
  findTopAlbum(): Promise<Result<Album[]>>;
  findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>>;
  findAlbumsByName(name: string, limit?: number, offset?: number): Promise<Result<Album[]>>;
}
