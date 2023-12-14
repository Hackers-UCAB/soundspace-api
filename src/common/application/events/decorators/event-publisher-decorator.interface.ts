import { DomainEvent } from "src/common/domain/domain-event";
import { IEventPublisher } from "../event-publisher.interface";
import { IEventSubscriber } from "../event-subscriber.interface";

export abstract class IEventPublisherDecorator extends IEventPublisher{
    protected decoratePublisher: IEventPublisher;

    constructor(decoratePublisher: IEventPublisher){
        super();
        this.decoratePublisher= decoratePublisher;
    }

    publish(events: DomainEvent[]): void {
        this.decoratePublisher.publish(events);
    }

    subscribe(event: string, subscribers: IEventSubscriber[]): void {
        this.decoratePublisher.subscribe(event, subscribers);
    }

    unsubscribe(event: string, subscriber: IEventSubscriber): void {
        this.decoratePublisher.unsubscribe(event, subscriber);
    }
}