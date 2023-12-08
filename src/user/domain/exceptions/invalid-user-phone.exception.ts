import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserPhoneException extends DomainException{

    constructor(msg: string){
        super(msg);
    }
}