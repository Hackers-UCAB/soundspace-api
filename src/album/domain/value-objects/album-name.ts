import { ValueObject } from 'src/common/domain/value-object';
import { InvalidAlbumNameException } from '../exceptions/invalid-album-name.exception';

export class AlbumName extends ValueObject<AlbumName> {
  private readonly name: string;

  constructor(name: string) {
    let valid: boolean = true;
    if (!name)
      throw new InvalidAlbumNameException(
        `El nombre del album ${name} no existe`,
      );

    //El nombre debe ser mayor a 3 y menor a 50
    if (name.length < 3 || name.length > 50) {
      valid = false;
    }

    if (!valid) {
      throw new InvalidAlbumNameException(
        `El nombre del album ${name} no es valido.`,
      );
    }
    super();
    this.name = name;
  }

  get Name() {
    return this.name;
  }

  equals(obj: AlbumName): boolean {
    return this.name === obj.name;
  }

  static create(name: string): AlbumName {
    return new AlbumName(name);
  }
}
