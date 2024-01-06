import { EventResponse } from "src/common/application/events/dto/response/event-response.dto";
import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { NotifierDto } from "src/common/application/notifications-handler/dto/entry/notifier-entry.dto";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { Result } from "src/common/application/result-handler/result";
import { SubscriptionCreated } from "src/subscription/domain/events/subscription-created.event";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";

export class NotifySubscriptionCreatedEvent implements IEventSubscriber{
    private readonly notifier: INotifier;
    private readonly subscriptionRepository: ISubscriptionRepository;

    constructor(notifier: INotifier, subscriptionRepository: ISubscriptionRepository){
        this.subscriptionRepository = subscriptionRepository;
        this.notifier = notifier;
    }

    async on(event: SubscriptionCreated): Promise<Result<EventResponse>> {
        const subcriptionChanel: Result<SubscriptionChanel> = await this.subscriptionRepository.findSubscriptionChanelById(event.chanel);
        
        const tittle = 'Bienvenido a SoundSpace';
        const body = subcriptionChanel.IsSuccess 
            ? `Te has suscrito mediante ${subcriptionChanel.data.Name.Name}, es hora de disfrutar la mejor música!`
            : 'Disfruta de la mejor musica'; 
        const message: NotifierDto = { 
            userId: event.user,
            tittle: tittle,
            body: body,         
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