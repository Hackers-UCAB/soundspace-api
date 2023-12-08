import { ValueObject } from "src/common/domain/value-object";


export class UserPhone extends ValueObject<UserPhone> {
    private readonly phone: string;

    private constructor(phone: string) {
        let valid: boolean = true;

        

        super();
        this.phone = phone;
    }

    get Phone(){
        return this.phone;
    }

    equals(obj: UserPhone): boolean {
        return this.phone === obj.phone;
    }

    static create(phone: string): UserPhone {
        return new UserPhone(phone);
    }
}