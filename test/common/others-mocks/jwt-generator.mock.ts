import { IJwtGenerator } from "src/auth/application/interface/jwt-generator.interface";
import { JwtPayload } from "src/auth/infraestructure/jwt/jwt-payload.interface";


export class JwtGeneratorMock implements IJwtGenerator {
    create(param: JwtPayload): string {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im1vY2siLCJpYXQiOjE1MTYyMzkwMjJ9.oK6mpu71Anc6wzPlEwNpeGDfF3sV0bGA0CIZUFcvoYk';    
    }
}
