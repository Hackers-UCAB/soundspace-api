import { Injectable } from "@nestjs/common";
import { IEventPublisher } from "src/common/application/events/event-publisher.interface";
import { IEventSubscriber } from "src/common/application/events/event-subscriber.interface";
import { Result } from "src/common/domain/result-handler/result";
import { EventResponse } from "src/common/application/events/dto/response/event-response.dto";
import { DomainEvent } from "src/common/domain/domain-event";

@Injectable()
export class EventBus extends IEventPublisher{
    protected subscribers: Map<string, IEventSubscriber[]>;
    
    constructor(){
        super();
    }

    async publish(events: DomainEvent[]): Promise<Result<EventResponse>[]>{
        const eventResponses: Result<EventResponse>[] = [];

        for (const event of events) {
            const subscribers = this.subscribers.get(event.constructor.name);
            const responses = await Promise.all(subscribers.map(async subscriber => {
                return subscriber.on(event);
            }));
            eventResponses.push(...responses);
        }
        
        return eventResponses;
    }
}