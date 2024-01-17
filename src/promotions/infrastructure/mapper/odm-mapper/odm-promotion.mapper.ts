import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotions/domain/promotion";
import { OdmPromotionEntity } from "../../persistence-entities/odm-entities/odm-promotion.entity";
import { PromotionId } from "src/promotions/domain/value-objects/promotion-id";
import { PromotionImageRef } from "src/promotions/domain/value-objects/promotion-image-ref";
import { PromotionUrl } from "src/promotions/domain/value-objects/promotion-url";


export class OdmPromotionMapper implements IMapper<Promotion, OdmPromotionEntity>{
    async toDomain(persistence: OdmPromotionEntity): Promise<Promotion> {
        if (persistence){
            const promotion: Promotion = await Promotion.create(
                PromotionId.create(persistence.codigo_publicidad),
                PromotionUrl.create(persistence.url_publicidad),
                PromotionImageRef.create(persistence.referencia_imagen),
            );
            return promotion;
        }
        return null;
    }
    toPersistence(domain: Promotion): Promise<OdmPromotionEntity> {
        throw new Error("Method not implemented.");
    }
    
}