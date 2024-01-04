import { Result } from 'src/common/application/result-handler/result';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';

export class CancelSubscriptionApplicationService
  implements IApplicationService<ServiceEntry, ServiceResponse>
{
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly userRepository: IUserRepository;
  constructor(
    subscriptionRepository: ISubscriptionRepository,
    userRepository: IUserRepository,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
  }

  async execute(param: ServiceEntry): Promise<Result<ServiceResponse>> {
    const userId: UserId = UserId.create(param.userId);
    //Buscamos la subscripcion
    const subscriptionResult: Result<Subscription> =
      await this.subscriptionRepository.findSubscriptionByUser(userId);

    if (!subscriptionResult.IsSuccess) {
      return Result.fail(
        null,
        subscriptionResult.statusCode,
        subscriptionResult.message,
        subscriptionResult.error,
      );
    }
    //Si se encuentra la subscripcion se busca al usuario
    const userResult: Result<User> =
      await this.userRepository.findUserById(userId);

    if (!userResult.IsSuccess) {
      return Result.fail(
        null,
        userResult.statusCode,
        userResult.message,
        userResult.error,
      );
    }

    const subscription: Subscription = subscriptionResult.Data;
    const user: User = userResult.Data;
    //Se cambia el estado de la subscripcion y el rol del usuario
    subscription.cancelSubscription();
    user.changedToGuest();

    //Guardamos en la base de datos

    const subscriptionUpdating: Result<string> =
      await this.subscriptionRepository.saveAggregate(subscription);

    if (!subscriptionUpdating.IsSuccess) {
      return Result.fail(
        null,
        subscriptionUpdating.statusCode,
        subscriptionUpdating.message,
        subscriptionUpdating.error,
      );
    }

    const userUpdating: Result<string> =
      await this.userRepository.saveAggregate(user);
    if (!userUpdating.IsSuccess) {
      return Result.fail(
        null,
        userUpdating.statusCode,
        userUpdating.message,
        userUpdating.error,
      );
    }
    const response: ServiceResponse = {
      userId: param.userId,
    };
    return Result.success(response, 200);
  }
}
