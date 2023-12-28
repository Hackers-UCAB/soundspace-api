import { ServiceResponse } from "src/common/application/services/response/service-response";
import { User } from "src/user/domain/user";


export class GetUserInfoResponseApplicationDto implements ServiceResponse{
    userId: string;
    user: User;
}