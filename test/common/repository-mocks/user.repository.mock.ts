import { Result } from "src/common/application/result-handler/result";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { User } from "src/user/domain/user";
import { UserId } from "src/user/domain/value-objects/user-id";

export class UserRepositoryMock implements IUserRepository {
    
    private readonly users: User[] = [];
    
    async saveAggregate(user: User, tokens?: string[]): Promise<Result<string>> {
        this.users.push(user);
        return Result.success('Usuario guardado correctamente', 200);
    }
    async findUserById(id: UserId): Promise<Result<User>> {
        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            if (user.Id.equals(id)) { return Result.success(user,200); }
        }
    }
    async deleteUserById(id: UserId): Promise<Result<string>> {
        const index = this.users.findIndex(user => user.Id.equals(id));
        this.users.splice(index, 1);
        return  Result.success('Usuario eliminado correctamente', 20);
    }   
    async updateTokens(id: UserId, token: string): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }

}