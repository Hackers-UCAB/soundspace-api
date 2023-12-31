import { ValueObject } from '../../../common/domain/value-object';
import { AlbumId } from '../../../album/domain/value-objects/album-id';
import { InvalidArtistAlbumsException } from "../exceptions/invalid-artist-albums.exception";

export class ArtistAlbums extends ValueObject<ArtistAlbums> {

  private readonly albums: AlbumId[];

  constructor(albums: AlbumId[]) {
    let valid: boolean = true;
    if (!albums) valid = false;
    if (!valid) {
      throw new InvalidArtistAlbumsException(`Album ID: '${albums}' not valid`);
    }
    super();
    this.albums = albums;
  }

  get Albums(): AlbumId[] {
    return this.albums;
  }

  equals(obj: ArtistAlbums): boolean {
    return this.albums === obj.albums;
  }

  static create(albums: AlbumId[]): ArtistAlbums {
    return new ArtistAlbums(albums);
  }
  
}