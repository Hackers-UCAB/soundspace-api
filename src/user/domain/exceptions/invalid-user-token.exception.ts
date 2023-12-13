import { DomainException } from "src/common/domain/domain-exception";


export class InvalidUserTokenException extends DomainException{
    constructor(msg: string){
        super(msg);
    }
}