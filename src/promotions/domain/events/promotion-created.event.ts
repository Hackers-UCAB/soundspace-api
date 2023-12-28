import { DomainEvent } from "src/common/domain/domain-event";
import { PromotionId } from "../value-objects/promotion-id";
import { PromotionImageRef } from "../value-objects/promotion-image-ref";
import { PromotionUrl } from "../value-objects/promotion-url";


export class PromotionCreated extends DomainEvent{
    protected constructor(
        public id: PromotionId,
        public url: PromotionUrl,
        public imageRef: PromotionImageRef
    ){
        super();
    }

    static create(
        id: PromotionId,
        url: PromotionUrl,
        imageRef: PromotionImageRef
    ): PromotionCreated{
        return new PromotionCreated(id, url, imageRef);
    }
}