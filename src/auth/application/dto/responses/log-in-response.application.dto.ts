import { ServiceResponse } from "src/common/application/services/response/service-response";


export class LogInResponseApplicationDto implements ServiceResponse {
    userId: string;
    token: string;
}

