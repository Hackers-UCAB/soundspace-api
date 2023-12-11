import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { Result } from 'src/common/application/result-handler/result';
import { AuthApplicationDto } from '../dto/auth.application.dto';
import { User } from 'src/user/domain/user';


export class LoginApplicationService implements IApplicationService<AuthApplicationDto,User>{

    constructor(private readonly userRepository: IUserRepository){
        this.userRepository = userRepository;
    }

    async execute(param: AuthApplicationDto): Promise<Result<User>> {
        
        const user = await this.userRepository.findUserByPhone(param.phoneNumber);
        return Result.success(user,200);
    }
}