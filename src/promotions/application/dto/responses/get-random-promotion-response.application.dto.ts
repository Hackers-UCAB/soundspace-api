import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";
import { Promotion } from "src/promotions/domain/promotion";


export class GetRandomPromotionResponseApplicationDto implements ServiceResponse{
    userId: string;
    promotion: Promotion;
    image: Buffer;
}