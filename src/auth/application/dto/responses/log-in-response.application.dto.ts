import { ServiceResponse } from "src/common/application/services/service-response";


export class LogInResponseApplicationDto implements ServiceResponse {
    userId: string;
    token: string;
}

