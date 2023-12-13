import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { SubscriptionExpired } from "src/subscription/domain/events/subscription-expired.event";

export class NotifySubscriptionExpiredEvent implements IEventSubscriber{
    private readonly notifier: INotifier;

    constructor(notifier: INotifier){
        this.notifier = notifier;
    }

    async on(event: SubscriptionExpired): Promise<void> {
        //buscar el nombre del canal de la subscripcion
        const tittle = 'SoundSpace Subscripcion Vencida';
        const body = 'Renueva tu subscripcion con *canal* para seguir disfrutando de la mejor musica';
        const message = { 
            userId: event.userId,
            tittle: tittle,
            body: body  
        };
        
        await this.notifier.notify(message);
    }

}