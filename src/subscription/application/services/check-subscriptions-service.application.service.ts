import { EmptyDto } from 'src/common/application/dto/empty.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceResponse } from 'src/common/application/services/response/service-response';
import { SubscriptionExpired } from 'src/subscription/domain/events/subscription-expired.event';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';

export class CheckSubscriptionsApplicationService
  implements IApplicationService<EmptyDto, ServiceResponse>
{
  private readonly subscriptionRepository: ISubscriptionRepository;
  private readonly eventPublisher: IEventPublisher;

  constructor(subscriptionRepository: ISubscriptionRepository, eventPublisher: IEventPublisher) {
      this.subscriptionRepository = subscriptionRepository;
      this.eventPublisher = eventPublisher;
  }
  async execute(param: EmptyDto): Promise<Result<ServiceResponse>> {
    //Primero tiene que buscar las que expiran ese dia. Crearles el evento
    //de dominio y publicarlas. Despues lo mismo con las de 15 dias.
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
        subscription.expireSubscription();
        this.eventPublisher.publish([subscription.pullDomainEvents().at(-1)]);
      });
    }
   
    const response: ServiceResponse = {
      userId: 'Admin',
    };
    return Result.success(response, 200);
  }
}
