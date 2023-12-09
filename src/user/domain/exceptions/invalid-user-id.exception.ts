import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserIdException extends DomainException{

    constructor(msg: string){
        super(msg);
    }
}