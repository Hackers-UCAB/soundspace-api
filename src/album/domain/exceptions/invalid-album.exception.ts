import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidAlbumException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
