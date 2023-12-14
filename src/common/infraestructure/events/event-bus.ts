import { Injectable } from "@nestjs/common";
import { IEventPublisher } from "src/common/application/events/event-publisher.interface";
import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { DomainEvent } from "src/common/domain/domain-event";

@Injectable()
export class EventBus extends IEventPublisher{
    protected subscribers: Map<string, IEventSubscriber[]>;
    
    constructor(){
        super();
    }

    publish(events: DomainEvent[]): void {
        events.forEach(event => {
            const subscribers = this.subscribers.get(event.constructor.name);
            subscribers.forEach(subscriber => subscriber.on(event));
        });
    }
}