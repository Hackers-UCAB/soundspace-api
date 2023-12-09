import { DomainEvent } from "./domain-event";
import { Entity } from "./entity";
import { ValueObject } from "./value-object";

export abstract class AggregateRoot<T extends ValueObject<T>> extends Entity<T> {
        protected events: DomainEvent[] = [];
    
    protected constructor(id: T, event: DomainEvent) {
        super(id);
        this.apply(event);
    }

    protected apply(event: DomainEvent): void{
        this.when(event);
        this.ensureValidaState();
        this.events.push(event);
    }

    protected abstract when(event: DomainEvent): void;

    //convencion en DDD para verificar la validez de un objeto despues 
    //de hacer una operacion
    protected abstract ensureValidaState(): void;
    
}