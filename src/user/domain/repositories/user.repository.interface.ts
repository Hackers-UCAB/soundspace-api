import { User } from "../user";
import { UserPhone } from "../value-objects/user-phone";

export interface IUserRepository{
    createUser(user: User): void;
    findUserByPhone(phone: UserPhone): Promise<User>;
}