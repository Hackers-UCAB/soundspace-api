import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { UserId } from './value-objects/user-id';
import { UserName } from './value-objects/user-name';
import { UserEmail } from './value-objects/user-email';
import { UserGender } from './value-objects/user-gender';
import { UserRole } from './value-objects/user-role';
import { UserBirthday } from './value-objects/user-birthday';
import { UserCreated } from './events/user-created.event';
import { InvalidUserException } from './exceptions/invalid-user.exception';
import { DomainEvent } from 'src/common/domain/domain-event';
import { UserChangedToGuest } from './events/user-changed-to-guest.event';
import { UserRoleEnum } from './value-objects/enum/user-role.enum';
import { UserNameModified } from './events/user-name-modified';
import { UserEmailModified } from './events/user-email-modified';
import { UserBirthdayModified } from './events/user-birthday-modified';
import { UserGenderModified } from './events/user-gender-modified';

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

    if (event instanceof UserNameModified) {
      this.name = event.name;
    }

    if (event instanceof UserEmailModified) {
      this.email = event.email;
    }

    if (event instanceof UserBirthdayModified) {
      this.birthday = event.birthday;
    }

    if (event instanceof UserGenderModified) {
      this.gender = event.gender;
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

  public updateName(name: UserName): void {
    this.apply(UserNameModified.create(this.Id, name));
  }

  public updateEmail(email: UserEmail): void {
    this.apply(UserEmailModified.create(this.Id, email));
  }

  public updateBirthday(birthday: UserBirthday): void {
    this.apply(UserBirthdayModified.create(this.Id, birthday));
  }

  public updateGender(gender: UserGender): void {
    this.apply(UserGenderModified.create(this.Id, gender));
  }

  public changedToGuest(): void {
    this.apply(
      UserChangedToGuest.create(this.Id, UserRole.create(UserRoleEnum.GUEST)),
    );
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
