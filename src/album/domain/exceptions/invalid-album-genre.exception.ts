import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidAlbumGenreException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
