import { ValueObject } from 'src/common/domain/value-object';
import { InvalidAlbumIdException } from '../exceptions/invalid-album-id.exception';

export class AlbumId extends ValueObject<AlbumId> {
  private readonly id: string;

  constructor(id: string) {
    let valid: boolean = true;

    if (!id) valid = false;

    if (!valid) {
      throw new InvalidAlbumIdException(`Album ID: '${id}' not valid`);
    }
    super();
    this.id = id;
  }

  get Id(): string {
    return this.id;
  }

  equals(obj: AlbumId): boolean {
    return this.id === obj.id;
  }

  static create(id: string): AlbumId {
    return new AlbumId(id);
  }
}
