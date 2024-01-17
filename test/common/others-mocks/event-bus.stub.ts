import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { EventResponse } from 'src/common/application/events/dto/response/event-response.dto';
import { IEventSubscriber } from 'src/common/application/events/event-subscriber.interface';
import { DomainEvent } from 'src/common/domain/domain-event';
import { Result } from 'src/common/domain/result-handler/result';


export class EventBusStub extends IEventPublisher {

    constructor() {
        super();   
    }
    async publish(events: DomainEvent[]): Promise<Result<EventResponse>[]> {
        return null
    }
    subscribe(event: string, subscribers: IEventSubscriber[]): void {
        throw new Error('Method not implemented.');
    }
    unsubscribe(event: string, subscriber: IEventSubscriber): void {
        throw new Error('Method not implemented.');
    }

}