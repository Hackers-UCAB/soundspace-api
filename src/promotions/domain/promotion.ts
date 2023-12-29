import { AggregateRoot } from "src/common/domain/aggregate-root";
import { PromotionId } from "./value-objects/promotion-id";
import { PromotionUrl } from "./value-objects/promotion-url";
import { PromotionImageRef } from "./value-objects/promotion-image-ref";
import { PromotionCreated } from "./events/promotion-created.event";
import { DomainEvent } from "src/common/domain/domain-event";
import { InvalidPromotionException } from "./exceptions/invalid-promotion.exceptipon";

export class Promotion extends AggregateRoot<PromotionId>{
    private url: PromotionUrl;
    private imageRef: PromotionImageRef;

    get Url(): PromotionUrl {
        return this.url;
    }

    get ImageRef(): PromotionImageRef {
        return this.imageRef;
    }

    protected constructor(
        id: PromotionId,
        url: PromotionUrl,
        imageRef: PromotionImageRef
    ) {
        const promotionCreated = PromotionCreated.create(
            id,
            url,
            imageRef
        );
        super(id, promotionCreated);
    }

    protected when(event: DomainEvent): void {
        if (event instanceof PromotionCreated) {
            this.url = event.url;
            this.imageRef = event.imageRef;
        }
    }

    protected ensureValidaState(): void {
        if (!this.url || !this.imageRef) throw new InvalidPromotionException('Promocion no valida');
    }

    static async create(
        id: PromotionId,
        url: PromotionUrl,
        imageRef: PromotionImageRef
    ): Promise<Promotion>{
        return new Promotion(id, url, imageRef);
    }
    
}