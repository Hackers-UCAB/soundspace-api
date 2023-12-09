import { ValueObject } from "./value-object";

export class Entity<T extends ValueObject<T>> {
    //id de la entidad, el cual es un VO
    private readonly id: T

    constructor(id: T) {
        this.id = id;
    }

    get Id() {
        return this.id;
    }

    equals(id: T): boolean {
        return this.id.equals(id);
    }
}