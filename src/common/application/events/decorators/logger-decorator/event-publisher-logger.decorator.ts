import { DomainEvent } from "src/common/domain/domain-event";
import { IEventPublisher } from "../../event-publisher.interface";
import { IEventPublisherDecorator } from "../event-publisher-decorator.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { Injectable } from "@nestjs/common";
import { Result } from "src/common/domain/result-handler/result";
import { EventResponse } from "../../dto/response/event-response.dto";

@Injectable()
export class EventPublisherLoggerDecorator extends IEventPublisherDecorator {
    protected decoratePublisher: IEventPublisher;
    private readonly logger: ILogger;

    constructor(decoratePublisher: IEventPublisher, logger: ILogger){
        super(decoratePublisher);
        this.logger = logger;
    }

    async publish(events: DomainEvent[]): Promise<Result<EventResponse>[]> {
        const eventResults = await super.publish(events);

        const date = new Date();

        eventResults.forEach(eventResult => {
            if (eventResult.IsSuccess){
                const log = { 
                    user: eventResult.Data.user, 
                    ocurredOn: date,
                    operation: eventResult.Data.event, 
                    data: eventResult.Data.data, 
                };
                this.logger.logSuccess(log);
            }
            else{
                const log = { 
                    user: 'unknown', //hay una forma de arreglar el logError y es modificando el Result :)
                    ocurredOn: date,
                    operation: eventResult.constructor.name, 
                    data: eventResult.message, 
                };
                this.logger.logError(log);
            }
        });

        return eventResults;
    }  
}