import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { User } from "src/user/domain/user";
import { UserId } from "src/user/domain/value-objects/user-id";
import { OdmUserEntity } from "../../persistence-entities/odm-entities/odm-user.entity";


export class OdmUserRepository implements IUserRepository{
    private readonly odmUserMapper: IMapper<User, OdmUserEntity>

    constructor(
        odmUserMapper: IMapper<User, OdmUserEntity>
    ) {
        this.odmUserMapper = odmUserMapper;
    }
    
    saveAggregate(user: User, tokens?: string[]): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    findUserById(id: UserId): Promise<Result<User>> {
        throw new Error("Method not implemented.");
    }
    deleteUserById(id: UserId): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    updateTokens(id: UserId, token: string): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
}