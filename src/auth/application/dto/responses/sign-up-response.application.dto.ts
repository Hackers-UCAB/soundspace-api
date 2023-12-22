import { ServiceResponse } from "src/common/application/services/response/service-response";


export class SignUpResponseApplicationDto implements ServiceResponse {
    userId: string;
    token: string;
}

