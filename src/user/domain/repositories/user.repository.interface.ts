import { User } from '../user';
import { Result } from "src/common/application/result-handler/result";
import { UserId } from '../value-objects/user-id';

  

export interface IUserRepository{
    saveAggregate(user: User, tokens?: string[]): Promise<Result<string>>;
    findUserById(id: UserId): Promise<Result<User>>;
    deleteUserById(id: UserId): Promise<Result<string>>;
    updateTokens(id: UserId, token: string): Promise<Result<string>>;
}