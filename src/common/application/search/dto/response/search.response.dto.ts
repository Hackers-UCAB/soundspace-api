import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";


export class SearchResponseApplicationDto implements ServiceResponse{
    userId: string;
    data: {
        id: string;
        name: string;
    }[]
}