import { DomainException } from 'src/common/domain/domain-exception';

export class InvalidAlbumCoverException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
