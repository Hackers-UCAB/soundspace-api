import { DomainEvent } from 'src/common/domain/domain-event';
import { UserBirthday } from '../value-objects/user-birthday';
import { UserId } from '../value-objects/user-id';

export class UserBirthdayModified extends DomainEvent {
  protected constructor(
    public id: UserId,
    public birthday: UserBirthday,
  ) {
    super();
  }

  static create(
    id: UserId,
    birthday: UserBirthday,
  ) {
    return new UserBirthdayModified(id, birthday);
  }
}
