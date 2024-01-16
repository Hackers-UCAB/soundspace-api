import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { User } from "src/user/domain/user";
import { GetUserInfoResponseApplicationDto } from "../dto/response/get-user-info-response.application.dto";
import { Result } from "src/common/domain/result-handler/result";
import { UserId } from "src/user/domain/value-objects/user-id";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";


export class GetUserInfoApplicationService implements IApplicationService<ServiceEntry, GetUserInfoResponseApplicationDto> {
    private readonly userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(param: ServiceEntry): Promise<Result<GetUserInfoResponseApplicationDto>> {
        const userId: UserId = UserId.create(param.userId);
        
        const userResult: Result<User> = await this.userRepository.findUserById(userId);
        if (!userResult.IsSuccess) {
            return Result.fail(null, userResult.statusCode, userResult.message, userResult.error);
        }
        const response: GetUserInfoResponseApplicationDto = {
            userId: param.userId,
            user: userResult.Data
        }
        return Result.success(response, 200);
    }
}