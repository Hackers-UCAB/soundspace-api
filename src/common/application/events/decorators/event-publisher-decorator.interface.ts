import { DomainEvent } from "src/common/domain/domain-event";
import { IEventPublisher } from "../event-publisher.interface";
import { IEventSubscriber } from "../event-subscriber.interface";
import { Result } from "../../../domain/result-handler/result";
import { EventResponse } from "../dto/response/event-response.dto";

export abstract class IEventPublisherDecorator extends IEventPublisher{
    protected decoratePublisher: IEventPublisher;

    constructor(decoratePublisher: IEventPublisher){
        super();
        this.decoratePublisher= decoratePublisher;
    }

    async publish(events: DomainEvent[]): Promise<Result<EventResponse>[]> {
        return await this.decoratePublisher.publish(events);
    }

    subscribe(event: string, subscribers: IEventSubscriber[]): void {
        this.decoratePublisher.subscribe(event, subscribers);
    }

    unsubscribe(event: string, subscriber: IEventSubscriber): void {
        this.decoratePublisher.unsubscribe(event, subscriber);
    }
}