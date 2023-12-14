import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { SubscriptionCreated } from "src/subscription/domain/events/subscription-created.event";

export class NotifySubscriptionCreatedEvent implements IEventSubscriber{
    private readonly notifier: INotifier;

    constructor(notifier: INotifier){
        this.notifier = notifier;
    }

    async on(event: SubscriptionCreated): Promise<void> {
        //buscar al usuario en su repo para obtener el nombre
        const tittle = 'Bienvenido a SoundSpace';
        const body = 'Disfruta de la mejor musica'; //el mensaje se puede mejorar con el payload del evento
        const message = { 
            userId: event.user,
            tittle: tittle,
            body: body  
        };

        await this.notifier.notify(message);
    }

}