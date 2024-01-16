
import { Result } from "src/common/domain/result-handler/result";
import { Promotion } from "src/promotions/domain/promotion";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";

export class PromotionRepositoryMock implements IPromotionRepository {
    private readonly promotions: Promotion[] = [];
    async saveAggregate(promotion: Promotion): Promise<Result<string>> {
        this.promotions.push(promotion);
        return Result.success('Promocion guardada correctamente', 200);
    }
    async findRandomPromotion(): Promise<Result<Promotion>> {
        if (this.promotions.length > 0) {
            const randomPromotion = this.promotions[Math.floor(Math.random() * this.promotions.length)];
            return Result.success(randomPromotion, 200);
        } else {
            return Result.fail(null, 404, 'No se encontraron promociones', new Error('No se encontraron promociones'));
        }
    }

    static create () { 
        return new PromotionRepositoryMock()
    }
}