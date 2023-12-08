import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserGenderException extends DomainException{

    constructor(msg: string){
        super(msg);
    }
}