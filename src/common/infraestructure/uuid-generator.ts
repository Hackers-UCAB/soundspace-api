import { IIdGenerator } from "../application/uuid/uuid.interface";

export class UuidGenerator implements IIdGenerator<string>{
    generate(): string {
        throw new Error("Method not implemented.");
    }
    
}