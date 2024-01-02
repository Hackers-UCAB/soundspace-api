import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { Result } from "src/common/application/result-handler/result";
import { SubscriptionCreated } from "src/subscription/domain/events/subscription-created.event";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";

export class NotifySubscriptionCreatedEvent implements IEventSubscriber{
    private readonly notifier: INotifier;
    private readonly subscriptionRepository: ISubscriptionRepository;

    constructor(notifier: INotifier, subscriptionRepository: ISubscriptionRepository){
        this.subscriptionRepository = subscriptionRepository;
        this.notifier = notifier;
    }

    async on(event: SubscriptionCreated): Promise<void> {
        const subcriptionChanel: Result<SubscriptionChanel> = await this.subscriptionRepository.findSubscriptionChanelById(event.chanel);
        
        const tittle = 'Bienvenido a SoundSpace';
        const body = subcriptionChanel.IsSuccess ? `Te has suscrito mediante el medio ${subcriptionChanel.data.Name.Name}, es hora de disfrutar la mejor música!` : 'Disfruta de la mejor musica'; //el mensaje se puede mejorar con el payload del evento
        const message = { 
            userId: event.user,
            tittle: tittle,
            body: body  
        };
        
        await this.notifier.notify(message);
    }

}