import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { Result } from "src/common/application/result-handler/result";
import { SubscriptionExpired } from "src/subscription/domain/events/subscription-expired.event";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";

export class NotifySubscriptionExpiredEvent implements IEventSubscriber{
    private readonly notifier: INotifier;
    private readonly subscriptionRepository: ISubscriptionRepository;

    constructor(notifier: INotifier, subscriptionRepository: ISubscriptionRepository) {
        this.notifier = notifier;
        this.subscriptionRepository = subscriptionRepository;
    }

    async on(event: SubscriptionExpired): Promise<void> {
        const subcriptionChanel: Result<SubscriptionChanel> = await this.subscriptionRepository.findSubscriptionChanelById(event.chanel);

        const tittle = 'SoundSpace Subscripcion Vencida';
        const body = subcriptionChanel.IsSuccess ? `Lamentablemente tu subscripcion a SoundSpace mediante el canal: ${subcriptionChanel.data.Name.Name} se ha acabado . Es hora de renovar para seguir disfrutando de la mejor musica!` : 'Lamentablemente se ha acabado tu subscripcion a SoundSpace. Es hora de renovar para seguir disfrutando de la mejor musica';
        const message = { 
            userId: event.userId,
            tittle: tittle,
            body: body  
        };
        await this.notifier.notify(message);
    }

}