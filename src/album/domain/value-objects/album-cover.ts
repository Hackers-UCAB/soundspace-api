import { ValueObject } from '../../../common/domain/value-object';
import { InvalidAlbumCoverException } from '../exceptions/invalid-album-cover.exception';

export class AlbumCover extends ValueObject<AlbumCover> {
  private readonly path: string;

  constructor(path: string) {
    let valid = true;
    if (!path) valid = false;
    if (!valid) {
      throw new InvalidAlbumCoverException(`Path '${path}' not valid`);
    }
    super();
    this.path = path;
  }

  equals(obj: AlbumCover): boolean {
    return this.path === obj.path;
  }

  get Path(): string {
    return this.path;
  }

  static create(path: string): AlbumCover {
    return new AlbumCover(path);
  }
}
