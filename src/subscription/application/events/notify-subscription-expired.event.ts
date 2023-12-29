import { EventResponse } from "src/common/application/events/dto/response/event-response.dto";
import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { NotifierDto } from "src/common/application/notifications-handler/dto/entry/notifier-entry.dto";
import { NotifierResponse } from "src/common/application/notifications-handler/dto/response/notifier-response.dto";
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
    
    //TODO: Estandarizar este evento en relacion al de subscriptionCreated, igual con el de nearToExpired
    async on(event: SubscriptionExpired): Promise<Result<EventResponse>> {
        const subcriptionChanel: Result<SubscriptionChanel> = await this.subscriptionChanelRepository.findSubscriptionChanelById(event.chanel);

        const tittle = 'SoundSpace Subscripcion Vencida';
        const body = subcriptionChanel.IsSuccess ? `Lamentablemente tu subscripcion a SoundSpace mediante el canal: ${subcriptionChanel.data.Name.Name} se ha acabado. Es hora de renovar para seguir disfrutando de la mejor musica!` : 'Lamentablemente se ha acabado tu subscripcion a SoundSpace. Es hora de renovar para seguir disfrutando de la mejor musica';
        const message: NotifierDto = { 
            userId: event.userId,
            tittle: tittle,
            body: body,
            data: {
                'action': 'changeUserRole',
                'navigateToRoute': 'none',
            }
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