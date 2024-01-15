import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Promotion } from "src/promotions/domain/promotion";
import { OrmPromotionEntity } from "../../persistence-entities/orm-entities/promotion.entity";
import { PromotionId } from "src/promotions/domain/value-objects/promotion-id";
import { PromotionImageRef } from "src/promotions/domain/value-objects/promotion-image-ref";
import { PromotionUrl } from "src/promotions/domain/value-objects/promotion-url";


export class OrmPromotionMapper implements IMapper<Promotion, OrmPromotionEntity>{
    async toDomain(persistence: OrmPromotionEntity): Promise<Promotion> {
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
    async toPersistence(domain: Promotion): Promise<OrmPromotionEntity> {
        if (domain) {
            const promotion = OrmPromotionEntity.create(
                domain.Id.Id,
                domain.Url.Path,
                domain.ImageRef.Path
            );
            return promotion;
        }
    }
    
}