import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { User } from "src/user/domain/user";
import { Result } from "src/common/application/result-handler/result";
import { UserPhone } from "src/user/domain/value-objects/user-phone";

export interface GetUserApplicationServiceDto {
    phone: string
}
export class GetUserApplicationService implements IApplicationService<GetUserApplicationServiceDto, User>{

    get name(): string {
        return 'GetUserApplicationService'
    }

    constructor(private readonly userRepository: IUserRepository){}

    async execute(param: GetUserApplicationServiceDto): Promise<Result<User>> {
        //const user = await this.userRepository.findUserByPhone(UserPhone.create(param.phone));
        const user = await this.userRepository.findAll();
        return Result.success(user[0], 200);
    }
}