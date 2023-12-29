import { Album } from '../Album';
import { Result } from 'src/common/application/result-handler/result';
import { AlbumId } from '../value-objects/album-id';

export interface IAlbumRepository {
  findAlbumById(albumId: AlbumId): Promise<Result<Album>>;
  findTopAlbum(): Promise<Result<Album[]>>;
}
