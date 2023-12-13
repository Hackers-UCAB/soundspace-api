import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { Result } from 'src/common/application/result-handler/result';
import { AuthApplicationDto } from '../dto/auth.application.dto';
import { User } from 'src/user/domain/user';
import { IJwtGenerator } from '../interface/jwt-generator.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';


export class LoginApplicationService implements IApplicationService<AuthApplicationDto,string>{

    private readonly subscriptionRepository: ISubscriptionRepository;
    private readonly tokenGenerator: IJwtGenerator;
    constructor(subscriptionRepository: ISubscriptionRepository, tokenGenerator: IJwtGenerator) {
        this.subscriptionRepository = subscriptionRepository;
        this.tokenGenerator = tokenGenerator;
    }

    async execute(param: AuthApplicationDto): Promise<Result<string>> {
        
        const sub = await this.subscriptionRepository.findSubscriptionByValue(SubscriptionValue.create(param.phoneNumber));
        const token = this.tokenGenerator.create({ id: (sub.User.Id).toString() });
        return Result.success(token,200);
    }
}