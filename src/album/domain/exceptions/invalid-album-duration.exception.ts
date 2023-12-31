import { DomainException } from 'src/common/domain/domain-exception';
export class InvalidAlbumDurationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
