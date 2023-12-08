import { ValueObject } from "src/common/domain/value-object";
import { InvalidUserEmailException } from "../exceptions/invalid-user-email.exception";


export class UserEmail extends ValueObject<UserEmail> {
    private readonly email: string;

    private constructor(email: string) {
        let valid: boolean = true;
        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (!regex.test(email)) {
            valid = false;
        }

        if(!valid){
            throw new InvalidUserEmailException(`El email ${email} no es valido.`);
        }
        
        super();
        this.email = email;
    }

    get Email(){
        return this.email;
    }

    equals(obj: UserEmail): boolean {
        return this.email === obj.email;
    }

    static create(email: string): UserEmail {
        return new UserEmail(email);
    }
}