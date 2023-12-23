import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { Result } from "src/common/application/result-handler/result";
import { SubscriptionExpired } from "src/subscription/domain/events/subscription-expired.event";
import { ISubscriptionChanelRepository } from "src/subscription/domain/repositories/subscription-chanel.repository.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";

export class NotifySubscriptionExpiredEvent implements IEventSubscriber{
    private readonly notifier: INotifier;
    private readonly subscriptionChanelRepository: ISubscriptionChanelRepository;

    constructor(notifier: INotifier, subscriptionChanelRepository: ISubscriptionChanelRepository) {
        this.notifier = notifier;
        this.subscriptionChanelRepository = subscriptionChanelRepository;
    }

    async on(event: SubscriptionExpired): Promise<void> {
        const subcriptionChanel: Result<SubscriptionChanel> = await this.subscriptionChanelRepository.findSubscriptionChanelById(event.chanel);

        const tittle = 'SoundSpace Subscripcion Vencida';
        const body = subcriptionChanel.IsSuccess ? `Lamentablemente tu subscripcion a SoundSpace mediante el canal: ${subcriptionChanel.data.Name.Name} se ha acabado . Es hora de renovar para seguir disfrutando de la mejor musica!` : 'Lamentablemente se ha acabado tu subscripcion a SoundSpace. Es hora de renovar para seguir disfrutando de la mejor musica';
        const message = { 
            userId: event.userId,
            tittle: tittle,
            body: body  
        };
        console.log(message);
        
        await this.notifier.notify(message);
    }

}