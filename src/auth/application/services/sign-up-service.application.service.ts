import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { AuthApplicationDto } from '../dto/auth.application.dto';
import { Result } from 'src/common/application/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';

export class SignUpApplicationService implements IApplicationService <AuthApplicationDto, string>{
    
    private readonly userRepository: IUserRepository;

    constructor(repository: IUserRepository){
        this.userRepository = repository;
    }

    async execute(param: AuthApplicationDto): Promise<Result<string>> {
        console.log(param.phoneNumber);
        
        const users = await this.userRepository.findAll();

        // console.log(users);
        

        return Result.success("Usuario registrado exitosamente", 201);
    }

}
