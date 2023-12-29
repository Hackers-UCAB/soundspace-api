import { EventResponse } from 'src/common/application/events/dto/response/event-response.dto';
import { IEventSubscriber } from 'src/common/application/events/event-subscriber.interface';
import { NotifierDto } from 'src/common/application/notifications-handler/dto/entry/notifier-entry.dto';
import { INotifier } from 'src/common/application/notifications-handler/notifier.interface';
import { Result } from 'src/common/application/result-handler/result';
import { SubscriptionNearToExpired } from 'src/subscription/domain/events/subscription-near-to-expired.event';
import { ISubscriptionChanelRepository } from 'src/subscription/domain/repositories/subscription-chanel.repository.interface';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';

export class NotifySubscriptionNearToExpiredEvent implements IEventSubscriber {
  private readonly notifier: INotifier;
  private readonly subscriptionChanelRepository: ISubscriptionChanelRepository;

  constructor(
    notifier: INotifier,
    subscriptionChanelRepository: ISubscriptionChanelRepository,
  ) {
    this.notifier = notifier;
    this.subscriptionChanelRepository = subscriptionChanelRepository;
  }

  async on(event: SubscriptionNearToExpired): Promise<Result<EventResponse>> {
    const subscriptionChanel: Result<SubscriptionChanel> = await this.subscriptionChanelRepository.findSubscriptionChanelById(
      event.chanel,
    );

    const tittle = 'SoundSpace Subscripcion Cerca de Vencerse';
    const body = subscriptionChanel.IsSuccess
      ? `Hola! Te escribimos para recordarte que tu subscripcion a SoundSpace mediante el canal: ${subscriptionChanel.data.Name.Name} esta cerca de vencerse. No te olvides de renovarla para seguir disfrutando de la mejor musica!`
      : `Hola! Te escribimos para recordarte que tu subscripcion a SoundSpace esta cerca de vencerse. No te olvides de renovarla para seguir disfrutando de la mejor musica!`;
    
    const message: NotifierDto = {
      userId: event.user,
      tittle: tittle,
      body: body,
      data: null
    };
    
    const notifierResult = await this.notifier.notify(message);
    
    const eventResponse: EventResponse = {
      user: 'Admin',  
      event: this.constructor.name,
      data: {
        'event-data': event,
        'notifications-payload': message,
        'notifications-response': notifierResult.Data,
      }
    };

    if (notifierResult.IsSuccess) {
      return Result.success<EventResponse>(
        eventResponse,
        notifierResult.statusCode
      );
    } else return Result.fail<EventResponse>(
        eventResponse,
        notifierResult.statusCode,
        notifierResult.message,
        notifierResult.error
      );
  }
}
