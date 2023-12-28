import { ServiceResponse } from "src/common/application/services/response/service-response";


export class UpdateUserInfoResponseApplicationDto implements ServiceResponse{
    userId: string;
    success: boolean;
}