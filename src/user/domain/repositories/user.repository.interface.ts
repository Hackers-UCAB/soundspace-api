import { UserPhone } from "../value-objects/user-phone";
import { User } from '../user';

  

export interface IUserRepository{
    findAll(): any;
    findUserByPhone(phone: string): Promise<User>;
}