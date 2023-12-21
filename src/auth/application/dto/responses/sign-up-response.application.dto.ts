import { ServiceResponse } from "src/common/application/services/service-response";


export class SignUpResponseApplicationDto implements ServiceResponse {
    userId: string;
    token: string;
}

