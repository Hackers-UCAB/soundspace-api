import { DomainEvent } from 'src/common/domain/domain-event';
import { UserGender } from '../value-objects/user-gender';
import { UserId } from '../value-objects/user-id';

export class UserGenderModified extends DomainEvent {
  protected constructor(
    public id: UserId,
    public gender: UserGender,
  ) {
    super();
  }

  static create(
    id: UserId,
    gender: UserGender,
  ) {
    return new UserGenderModified(id, gender);
  }
}
