import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserBirthdayException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}