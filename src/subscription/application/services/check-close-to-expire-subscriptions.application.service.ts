import { EmptyDto } from 'src/common/application/dto/empty.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

export class CheckCloseToExpireSubscriptionsApplicationService
  implements IApplicationService<ServiceEntry, ServiceResponse>
{
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly eventPublisher: IEventPublisher;

  constructor(
    subscriptionRepository: ISubscriptionRepository,
    eventPublisher: IEventPublisher,
  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.eventPublisher = eventPublisher;
  }
  async execute(param: EmptyDto): Promise<Result<ServiceResponse>> {
    const actualDate: Date = new Date();
    actualDate.setDate(actualDate.getDate() + 15);
    const subscriptionsExpired15Days: Result<Subscription[]> =
      await this.subscriptionRepository.findSubscriptionsExpiringOnDate(
        actualDate,
      );

    if (!subscriptionsExpired15Days.IsSuccess) {
      return Result.fail(
        null,
        subscriptionsExpired15Days.statusCode,
        subscriptionsExpired15Days.message,
        subscriptionsExpired15Days.error,
      );
    }

    if (subscriptionsExpired15Days.Data.length > 0) {
      await Promise.all(
        subscriptionsExpired15Days.Data.map(async (subscription) => {
          subscription.nearToExpireSubscription();

          const subscriptionUpdating: Result<string> =
            await this.subscriptionRepository.saveAggregate(subscription);

          if (subscriptionUpdating.IsSuccess) {
            this.eventPublisher.publish([
              subscription.pullDomainEvents().at(-1),
            ]);
          }
        }),
      );
    }

    const response: ServiceResponse = {
      userId: 'Admin',
    };

    return Result.success(response, 200);
  }
}
