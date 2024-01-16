import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { Promotion } from "src/promotions/domain/promotion";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";
import { OdmPromotionEntity } from "../../persistence-entities/odm-entities/odm-promotion.entity";


export class OdmPromotionRepository implements IPromotionRepository{
    private readonly odmPromotionMapper: IMapper<Promotion, OdmPromotionEntity>;

    constructor(
        odmPromotionMapper: IMapper<Promotion, OdmPromotionEntity>
    ){
        this.odmPromotionMapper = odmPromotionMapper;
    }
    saveAggregate(promotion: Promotion): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    findRandomPromotion(): Promise<Result<Promotion>> {
        throw new Error("Method not implemented.");
    }
    
}