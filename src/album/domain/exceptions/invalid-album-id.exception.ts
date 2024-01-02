import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidAlbumIdException extends DomainException {
  constructor(msg: string) {
    super(msg);
  }
}
