import { UuidGenerator } from "src/common/infraestructure/uuid-generator";
import { Promotion } from "src/promotions/domain/promotion";
import { PromotionId } from "src/promotions/domain/value-objects/promotion-id";
import { PromotionImageRef } from "src/promotions/domain/value-objects/promotion-image-ref";
import { PromotionUrl } from "src/promotions/domain/value-objects/promotion-url";


export class PromotionObjectMother{

    static createRandomPromotion(){
        const idGenerator = new UuidGenerator()
    
        const randomPromotion = Promotion.create(
            PromotionId.create(idGenerator.generate()),
            PromotionUrl.create('https://promocion.com'),
            PromotionImageRef.create('imagen.png'),
        )
        return randomPromotion;
    }

}

