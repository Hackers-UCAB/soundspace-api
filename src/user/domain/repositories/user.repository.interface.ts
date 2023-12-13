import { UserPhone } from "../value-objects/user-phone";
import { User } from '../user';
import { OrmUserEntity } from "src/user/infraestructure/orm-entities/user.entity";
import { Result } from "src/common/application/result-handler/result";

  

export interface IUserRepository{
    saveAggregate(user: User): Promise<Result<string>>;
    findUserById(id: string): Promise<OrmUserEntity>;
    deleteUserById(id: string): Promise<Result<string>>;
}