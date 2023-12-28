import { DomainEvent } from "src/common/domain/domain-event";
import { IEventPublisher } from "../../event-publisher.interface";
import { IEventPublisherDecorator } from "../event-publisher-decorator.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventPublisherLoggerDecorator extends IEventPublisherDecorator {
    protected decoratePublisher: IEventPublisher;
    private readonly logger: ILogger;

    constructor(decoratePublisher: IEventPublisher, logger: ILogger){
        super(decoratePublisher);
        this.logger = logger;
    }

    publish(events: DomainEvent[]): void {
        super.publish(events);
        //aqui seria mas interesante que, en lugar de que publish regrese void, regrese un result con 
        //los eventos que se pudieron publicar y los que no
        const date = new Date();

        events.forEach(event => {
            const log = { 
                user: 'Admin', 
                ocurredOn: date,
                operation: event.constructor.name, 
                data: `data: ${JSON.stringify(event)}`, //esto se puede mejorar con lo de arriba
            };

            this.logger.execute(log);
        });
    }  
}