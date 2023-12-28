import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { User } from "src/user/domain/user";
import { GetUserInfoResponseApplicationDto } from "../dto/responses/get-user-info-response.application.dto";
import { Result } from "src/common/application/result-handler/result";
import { UserId } from "src/user/domain/value-objects/user-id";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";


export class GetUserInfoApplicationService implements IApplicationService<UserId, GetUserInfoResponseApplicationDto> {
    private readonly userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async execute(param: UserId): Promise<Result<GetUserInfoResponseApplicationDto>> {
        const userResult: Result<User> = await this.userRepository.findUserById(param);
        if (!userResult.IsSuccess) {
            return Result.fail(null, userResult.statusCode, userResult.message, userResult.error);
        }
        const response: GetUserInfoResponseApplicationDto = {
            userId: param.Id,
            user: userResult.Data
        }
        return Result.success(response, 200);
    }
}