import { IIdGenerator } from "src/common/application/id-generator/id-generator.interface";


export class UuidGeneratorMock implements IIdGenerator<string> {
    public generate(): string {
        return 'a851a626-ac84-4a1b-b620-600755d89018';
    }

    static create() {
        return new UuidGeneratorMock();
    }
}