import { DomainEvent } from "src/common/domain/domain-event";
import { Result } from "../result-handler/result";
import { EventResponse } from "./dto/response/event-response.dto";

export interface IEventSubscriber{
    on(event: DomainEvent): Promise<Result<EventResponse>>;
}