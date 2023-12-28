import { Result } from "src/common/application/result-handler/result";
import { Promotion } from "../promotion";


export interface IPromotionRepository{
    saveAggregate(promotion: Promotion) : Promise<Result<string>>;
    findRandomPromotion(): Promise<Result<Promotion>>
}