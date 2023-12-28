import { IEventSubscriber } from 'src/common/application/events/event-subscriber.interface';
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
  async on(event: SubscriptionNearToExpired): Promise<void> {
    const subscriptionChanel: Result<SubscriptionChanel> = await this.subscriptionChanelRepository.findSubscriptionChanelById(
      event.chanel,
    );

    const tittle = 'SoundSpace Subscripcion Cerca de Vencerse';
    const body = subscriptionChanel.IsSuccess
      ? `Hola! Te escribimos para recordarte que tu subscripcion a SoundSpace mediante el canal: ${subscriptionChanel.data.Name.Name} esta cerca de vencerse. No te olvides de renovarla para seguir disfrutando de la mejor musica!`
      : `Hola! Te escribimos para recordarte que tu subscripcion a SoundSpace esta cerca de vencerse. No te olvides de renovarla para seguir disfrutando de la mejor musica!`;
    const message = {
      userId: event.user,
      tittle: tittle,
      body: body,
    };
    
    await this.notifier.notify(message);
  }
}
