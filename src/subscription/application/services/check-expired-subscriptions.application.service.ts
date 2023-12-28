import { EmptyDto } from 'src/common/application/dto/empty.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceResponse } from 'src/common/application/services/response/service-response';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';

export class CheckExpiredSubscriptionsApplicationService
  implements IApplicationService<EmptyDto, ServiceResponse>
{
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly userRepisitory: IUserRepository;
  private readonly eventPublisher: IEventPublisher;

  constructor(
    subscriptionRepository: ISubscriptionRepository,
    userRepisitory: IUserRepository,
    eventPublisher: IEventPublisher,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.userRepisitory = userRepisitory;
    this.eventPublisher = eventPublisher;
  }
  async execute(param: EmptyDto): Promise<Result<ServiceResponse>> {
    const actualDate: Date = new Date();
    const subscriptionsExpiredToday: Result<Subscription[]> =
      await this.subscriptionRepository.findSubscriptionsExpiringOnDate(
        actualDate,
      );

    if (!subscriptionsExpiredToday.IsSuccess) {
      return Result.fail(
        null,
        subscriptionsExpiredToday.statusCode,
        subscriptionsExpiredToday.message,
        subscriptionsExpiredToday.error,
      );
    }
    if (subscriptionsExpiredToday.Data.length > 0) {
      subscriptionsExpiredToday.Data.forEach(async (subscription) => {
        const userResult: Result<User> = await this.userRepisitory.findUserById(
          subscription.User,
        );
        if (userResult.IsSuccess) {
          const user: User = userResult.Data;
          user.changedToGuest();

          const userUpdating: Result<string> =
            await this.userRepisitory.updateAggregate(user);
          if (userUpdating.IsSuccess) {
            subscription.expireSubscription();

            const subscriptionUpdating: Result<string> =
              await this.subscriptionRepository.updateAggregate(subscription);
            if (subscriptionUpdating.IsSuccess) {
              this.eventPublisher.publish([
                subscription.pullDomainEvents().at(-1),
              ]);
            }
          }
        }
      });
    }
    const response: ServiceResponse = {
      userId: 'Admin',
    };
    return Result.success(response, 200);
  }
}
