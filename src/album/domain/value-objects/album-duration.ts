import { ValueObject } from '../../../common/domain/value-object';
import { InvalidAlbumDurationException } from '../exceptions/invalid-album-duration.exception';

export class AlbumDuration extends ValueObject<AlbumDuration> {
  private readonly albumduration: number;

  constructor(albumduration: number) {
    let valid = true;
    if (!albumduration) valid = false;
    if (!valid) {
      throw new InvalidAlbumDurationException(
        `duration '${albumduration}' not valid`,
      );
    }
    super();
    this.albumduration = albumduration;
  }

  get AlbumDuration(): number {
    return this.albumduration;
  }

  equals(obj: AlbumDuration): boolean {
    return this.albumduration === obj.albumduration;
  }

  static create(albumduration: number): AlbumDuration {
    return new AlbumDuration(albumduration);
  }
}
