import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { UserId } from './value-objects/user-id';
import { UserName } from './value-objects/user-name';
import { UserEmail } from './value-objects/user-email';
import { UserGender } from './value-objects/user-gender';
import { UserRole } from './value-objects/user-role';
import { UserPhone } from './value-objects/user-phone';
import { UserBirthday } from './value-objects/user-birthday';
import { UserCreated } from './events/user-created.event';
import { InvalidUserException } from './exceptions/invalid-user.exception';
import { DomainEvent } from 'src/common/domain/domain-event';
import { UserGenderEnum } from './value-objects/enum/user-gender.enum';
import { UserUpdated } from './events/user-updated.event';
import { UserChangedToGuest } from './events/user-changed-to-guest.event';
import { UserRoleEnum } from './value-objects/enum/user-role.enum';

export class User extends AggregateRoot<UserId> {
  private name: UserName;
  private birthday: UserBirthday;
  private email: UserEmail;
  private gender: UserGender;
  private role: UserRole;

  get Name(): UserName {
    return this.name;
  }
  get Email(): UserEmail {
    return this.email;
  }
  get Gender(): UserGender {
    return this.gender;
  }
  get Role(): UserRole {
    return this.role;
  }

  get Birthday(): UserBirthday {
    return this.birthday;
  }

  protected constructor(
    userId: UserId,
    userRole: UserRole,
    userName?: UserName,
    userBirthday?: UserBirthday,
    userEmail?: UserEmail,
    userGender?: UserGender,
  ) {
    const userCreated = UserCreated.create(
      userId,
      userRole,
      userName,
      userBirthday,
      userEmail,
      userGender,
    );
    super(userId, userCreated);
  }

  protected when(event: DomainEvent): void {
    if (event instanceof UserCreated) {
      this.role = event.userRole;
      this.gender = event.userGender;
      this.name = event.userName;
      this.birthday = event.userBirthday;
      this.email = event.userEmail;
    }

    if (event instanceof UserUpdated) {
      this.name = event.name ? event.name : this.name;
      this.birthday = event.birthday ? event.birthday : this.birthday;
      this.email = event.email ? event.email : this.email;
      this.gender = event.gender ? event.gender : this.gender;
    }

    if (event instanceof UserChangedToGuest) {
      this.role = event.userRole;
    }
  }
  protected ensureValidaState(): void {
    if (!this.role || !this.Id) {
      throw new InvalidUserException('User not valid');
    }
  }

  public changedToGuest(): void {
    this.apply(
      UserChangedToGuest.create(this.Id, UserRole.create(UserRoleEnum.GUEST)),
    );
  }

  public updateUser(
    name?: UserName,
    birthday?: UserBirthday,
    email?: UserEmail,
    gender?: UserGender,
  ): void {
    this.apply(UserUpdated.create(this.Id, name, birthday, email, gender));
  }

  static async create(
    userId: UserId,
    userRole: UserRole,
    userName?: UserName,
    userBirthday?: UserBirthday,
    userEmail?: UserEmail,
    userGender?: UserGender,
  ): Promise<User> {
    return new User(
      userId,
      userRole,
      userName,
      userBirthday,
      userEmail,
      userGender,
    );
  }
}
