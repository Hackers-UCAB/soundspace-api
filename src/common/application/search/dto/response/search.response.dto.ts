import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";


export class SearchItemsResponseApplicationDto implements ServiceResponse{
    userId: string;
    data: {
        id: string;
        name: string;
        duration?: string
    }[]
}