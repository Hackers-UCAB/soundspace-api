import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IJwtGenerator } from '../interface/jwt-generator.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { Subscription } from 'src/subscription/domain/subscription';
import { LogInEntryApplicationDto } from '../dto/entrys/log-in-entry.application.dto';
import { LogInResponseApplicationDto } from '../dto/responses/log-in-response.application.dto';

export class LoginApplicationService
  implements IApplicationService<LogInEntryApplicationDto, LogInResponseApplicationDto>
{
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly userRepository: IUserRepository;
  private readonly tokenGenerator: IJwtGenerator;
  constructor(
    subscriptionRepository: ISubscriptionRepository,
    userRepository: IUserRepository,
    tokenGenerator: IJwtGenerator,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(param: LogInEntryApplicationDto): Promise<Result<LogInResponseApplicationDto>> {
    const subscription: Result<Subscription> =
      await this.subscriptionRepository.findSubscriptionByValue(
        SubscriptionValue.create(param.phone),
      );
    if (!subscription.IsSuccess) {
      return Result.fail(
        null,
        500,
        subscription.message || 'Ha ocurrido un error inesperado, hable con un administrador',
        subscription.error || new Error('Ha ocurrido un error inesperado, hable con un administrador')
      );
    }
    if (!subscription.Data) {
      return Result.fail(
        null,
        404,
        'No existe una subscripción con ese valor',
        new Error('No existe una subscripción con ese valor'),
      );
    }
    
    const updateTokens = await this.userRepository.updateTokens(
      subscription.Data.User,
      param.token
      );
      
      //TODO: Manejamos la excepcion?

    const token = this.tokenGenerator.create({ id: subscription.Data.User.Id });
    
    const response: LogInResponseApplicationDto = {
      userId: subscription.Data.User.Id,
      token,
    };
    return Result.success(response, 200);
  }
}
