import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";


export class LogInResponseApplicationDto implements ServiceResponse {
    userId: string;
    token: string;
}

