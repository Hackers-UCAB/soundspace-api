import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserEmailException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}