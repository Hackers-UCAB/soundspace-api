import { ValueObject } from 'src/common/domain/value-object';
import { InvalidAlbumSongsException } from '../exceptions/invalid-album-songs.exception';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class AlbumSongs extends ValueObject<AlbumSongs> {
  private readonly id: SongId[];

  constructor(id: SongId[]) {
    let valid = true;
    if (!id) valid = false;
    if (!valid) {
      throw new InvalidAlbumSongsException(`Id '${id}' not valid`);
    }
    super();
    this.id = id;
  }

  get Id(): SongId[] {
    return this.id;
  }

  equals(obj: AlbumSongs): boolean {
    return this.id === obj.id;
  }

  static create(id: SongId[]): AlbumSongs {
    return new AlbumSongs(id);
  }
}
