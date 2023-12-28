import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";
import { User } from "src/user/domain/user";


export class GetUserInfoResponseApplicationDto implements ServiceResponse{
    userId: string;
    user: User;
}