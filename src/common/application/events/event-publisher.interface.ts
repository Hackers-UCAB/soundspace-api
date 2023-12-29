import { DomainEvent } from "src/common/domain/domain-event";
import { IEventSubscriber } from "./event-subscriber.interface";
import { Result } from "../result-handler/result";
import { EventResponse } from "./dto/response/event-response.dto";

//con injectable o module ref

export abstract class IEventPublisher {
    protected subscribers: Map<string, IEventSubscriber[]>;
    
    constructor(){
        this.subscribers = new Map<string, IEventSubscriber[]>();
    }

    abstract publish(events: DomainEvent[]): Promise<Result<EventResponse>[]>;

    subscribe(event: string, subscribers: IEventSubscriber[]): void{
        //validar si no esta suscrito
        this.subscribers.set(event, subscribers);
    }
    
    unsubscribe(event: string, subscriber: IEventSubscriber): void{
        //validar si esta suscrito
        if (this.includes(event, subscriber))
            this.subscribers.set(event, this.subscribers.get(event).filter(s => s !== subscriber));
    }

    private includes(event: string, subscriber: IEventSubscriber): boolean{
        if (this.subscribers.has(event)){
            return this.subscribers.get(event).includes(subscriber);
        }
        return false;
    }
}