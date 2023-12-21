import { EmptyDto } from "src/common/application/dto/empty.dto";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { LogInResponseApplicationDto } from "../dto/responses/log-in-response.application.dto";
import { Result } from "src/common/application/result-handler/result";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { IJwtGenerator } from "../interface/jwt-generator.interface";
import { IIdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { User } from "src/user/domain/user";
import { UserId } from "src/user/domain/value-objects/user-id";
import { UserRole } from "src/user/domain/value-objects/user-role";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";


export class LoginGuestApplicationService implements IApplicationService<EmptyDto, LogInResponseApplicationDto>{
    private readonly userRepository: IUserRepository;
    private readonly tokenGenerator: IJwtGenerator;
    private readonly idGenerator: IIdGenerator<string>;
    constructor(userRepository: IUserRepository, tokenGenerator: IJwtGenerator, idGenerator: IIdGenerator<string>) {
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
        this.idGenerator = idGenerator;
    }
   async  execute(param: EmptyDto): Promise<Result<LogInResponseApplicationDto>> {
        const userId = this.idGenerator.generate();

        const newUser = await User.create(
            UserId.create(userId),
            UserRole.create(UserRoleEnum.GUEST)
        )

        const userSaving: Result<string> = await this.userRepository.saveAggregate(newUser);
        if (!userSaving.IsSuccess) {
            return Result.fail(
                null,
                userSaving.StatusCode || 500,
                userSaving.message || 'Ha ocurrido un error inesperado, hable con un administrador',
                userSaving.error || new Error('Ha ocurrido un error inesperado, hable con un administrador')
            );
        }
        const token = this.tokenGenerator.create({ id: userId });
        const response: LogInResponseApplicationDto = {
            userId,
            token
        }
        return Result.success(response, 201);
    }
    
}