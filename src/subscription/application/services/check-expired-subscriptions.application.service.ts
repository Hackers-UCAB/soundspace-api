import { EmptyDto } from 'src/common/application/dto/empty.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

export class CheckExpiredSubscriptionsApplicationService
  implements IApplicationService<ServiceEntry, ServiceResponse>
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
      await Promise.all(subscriptionsExpiredToday.Data.map(async (subscription) => { 
        const userResult: Result<User> = await this.userRepisitory.findUserById(subscription.User);
        
        if (userResult.IsSuccess) {
          const user: User = userResult.Data;
          user.changedToGuest();

          const userUpdating: Result<string> = await this.userRepisitory.saveAggregate(user);

          if (userUpdating.IsSuccess) {
            subscription.expireSubscription();

            const subscriptionUpdating: Result<string> = await this.subscriptionRepository.saveAggregate(subscription);
            if (subscriptionUpdating.IsSuccess) {
              this.eventPublisher.publish([subscription.pullDomainEvents().at(-1)]);
            }
          }else{
            //TODO: Esto en verdad esta mal
            console.log(userUpdating.message);
          }
        }
      }));
    }

    const response: ServiceResponse = {
      userId: 'Admin',
    };
    
    return Result.success(response, 200);
  }
}
