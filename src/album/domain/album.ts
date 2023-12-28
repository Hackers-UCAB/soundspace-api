import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { DomainEvent } from 'src/common/domain/domain-event';
import { AlbumCover } from './value-objects/album-cover';
import { AlbumDuration } from './value-objects/album-duration';
import { AlbumGenre } from './value-objects/album-genre';
import { AlbumId } from './value-objects/album-id';
import { AlbumName } from './value-objects/album-name';
import { AlbumSongs } from './value-objects/album-songs';
import { AlbumCreated } from './events/album-created.event';
import { InvalidAlbumException } from './exceptions/invalid-album.exception';
export class Album extends AggregateRoot<AlbumId> {
  private name: AlbumName;
  private cover: AlbumCover;
  private albumSongs: AlbumSongs;
  private duration: AlbumDuration;
  private genre: AlbumGenre;

  get Name(): AlbumName {
    return this.name;
  }

  get Cover(): AlbumCover {
    return this.cover;
  }

  get AlbumSongs(): AlbumSongs {
    return this.albumSongs;
  }

  get Duration(): AlbumDuration {
    return this.duration;
  }

  get Genre(): AlbumGenre {
    return this.genre;
  }

  protected constructor(
    id: AlbumId,
    name: AlbumName,
    cover: AlbumCover,
    albumSongs: AlbumSongs,
    duration: AlbumDuration,
    genre: AlbumGenre,
  ) {
    const albumCreated = AlbumCreated.create(
      id,
      name,
      cover,
      albumSongs,
      duration,
      genre,
    );
    super(id, albumCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof AlbumCreated) {
      this.name = event.name;
      this.cover = event.cover;
      this.albumSongs = event.albumSongs;
      this.duration = event.duration;
      this.genre = event.genre;
    }
  }

  protected ensureValidaState(): void {
    if (
      !this.name ||
      !this.cover ||
      !this.albumSongs ||
      !this.duration ||
      !this.genre
    ) {
      throw new InvalidAlbumException('Album not valid');
    }
  }

  static create(
    id: AlbumId,
    name: AlbumName,
    cover: AlbumCover,
    albumSongs: AlbumSongs,
    duration: AlbumDuration,
    genre: AlbumGenre,
  ): Album {
    const album = new Album(id, name, cover, albumSongs, duration, genre);
    return album;
  }
}
