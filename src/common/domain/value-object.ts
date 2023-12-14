//No necesita su getter?
export abstract class ValueObject<T>{
    abstract equals(obj: T): boolean;
}