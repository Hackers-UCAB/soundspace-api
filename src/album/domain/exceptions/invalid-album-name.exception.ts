import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidAlbumNameException extends DomainException {
  constructor(msg: string) {
    super(msg);
  }
}
