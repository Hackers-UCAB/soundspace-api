import { DomainEvent } from "src/common/domain/domain-event";

export interface IEventSubscriber{
    on(event: DomainEvent): Promise<void>;
}