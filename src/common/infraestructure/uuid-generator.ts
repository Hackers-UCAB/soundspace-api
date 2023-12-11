import {v4 as uuid} from 'uuid'

import { IIdGenerator } from "../application/id-generator/id-generator.interface";

export class UuidGenerator implements IIdGenerator<string>{
    generate(): string {
        return uuid();
    }
    
}