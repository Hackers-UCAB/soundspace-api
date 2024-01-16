import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotions/domain/promotion";
import { OdmPromotionEntity } from "../../persistence-entities/odm-entities/odm-promotion.entity";


export class OdmPromotionMapper implements IMapper<Promotion, OdmPromotionEntity>{
    toDomain(persistence: OdmPromotionEntity): Promise<Promotion> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: Promotion): Promise<OdmPromotionEntity> {
        throw new Error("Method not implemented.");
    }
    
}