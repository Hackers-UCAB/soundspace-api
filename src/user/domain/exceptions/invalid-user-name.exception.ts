import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserNameException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}