import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { AuthApplicationDto } from '../dto/auth.application.dto';
import { Result } from 'src/common/application/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { ISubscriptionChanelRepository } from 'src/subscription/domain/repositories/subscription-chanel.repository.interface';
import { SignUpApplicationDto } from '../dto/sign-up.application.dto';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';

export class SignUpApplicationService
  implements IApplicationService<AuthApplicationDto, string>
{
  private readonly userRepository: IUserRepository;
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly subscriptionChanelRepository: ISubscriptionChanelRepository;

  private readonly idGenerator: IIdGenerator<string>;

  constructor(
    userRepository: IUserRepository,
    subscriptionRepository: ISubscriptionRepository,
    subscriptionChanelRepository: ISubscriptionChanelRepository,
    idGenerator: IIdGenerator<string>,
  ) {
    this.idGenerator = idGenerator;
    this.subscriptionChanelRepository = subscriptionChanelRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
  }

  async execute(param: SignUpApplicationDto): Promise<Result<string>> {
    // console.log(param.phoneNumber);
    
    //const chanel = await this.subscriptionChanelRepository.findSubscriptionChanelById(SubscriptionChanelId.create(param.chanelId));

    
    return Result.success('Usuario registrado exitosamente', 201);
  }
}
