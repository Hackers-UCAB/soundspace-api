import { ValueObject } from '../../../common/domain/value-object';
import { InvalidAlbumGenreException } from '../exceptions/invalid-album-genre.exception';

export class AlbumGenre extends ValueObject<AlbumGenre> {
  private readonly albumgenre: string;

  constructor(albumgenre: string) {
    let valid = true;
    if (!albumgenre) valid = false;
    if (!valid) {
      throw new InvalidAlbumGenreException(
        `album genre '${albumgenre}' not valid`,
      );
    }
    super();
    this.albumgenre = albumgenre;
  }

  get Genre(): string {
    return this.albumgenre;
  }

  equals(obj: AlbumGenre): boolean {
    return this.albumgenre === obj.albumgenre;
  }

  static create(albumgenre: string): AlbumGenre {
    return new AlbumGenre(albumgenre);
  }
}
