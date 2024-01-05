import { DomainEvent } from 'src/common/domain/domain-event';
import { AlbumCover } from '../value-objects/album-cover';
import { AlbumDuration } from '../value-objects/album-duration';
import { AlbumGenre } from '../value-objects/album-genre';
import { AlbumId } from '../value-objects/album-id';
import { AlbumName } from '../value-objects/album-name';
import { AlbumSongs } from '../value-objects/album-songs';

export class AlbumCreated extends DomainEvent {
  protected constructor(
    public id: AlbumId,
    public name: AlbumName,
    public cover: AlbumCover,
    public albumSongs: AlbumSongs,
    //public duration: AlbumDuration,
    public genre: AlbumGenre,
  ) {
    super();
  }

  static create(
    id: AlbumId,
    name: AlbumName,
    cover: AlbumCover,
    albumSongs: AlbumSongs,
    //duration: AlbumDuration,
    genre: AlbumGenre,
  ): AlbumCreated {
    return new AlbumCreated(id, name, cover, albumSongs, genre);
  }
}
