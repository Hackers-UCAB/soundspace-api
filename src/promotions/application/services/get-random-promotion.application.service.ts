import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { GetRandomPromotionResponseApplicationDto } from "../dto/responses/get-random-promotion-response.application.dto";
import { Result } from "src/common/application/result-handler/result";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";
import { Promotion } from "src/promotions/domain/promotion";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { IGetBufferImageInterface } from "src/common/domain/interfaces/get-buffer-image.interface";


export class GetRandomPromotionApplicationService implements IApplicationService<ServiceEntry, GetRandomPromotionResponseApplicationDto>{
    private readonly promotionRepository: IPromotionRepository;
    private readonly getBufferImage: IGetBufferImageInterface
    constructor(promotionRepository: IPromotionRepository, getBufferImage: IGetBufferImageInterface) {
        this.promotionRepository = promotionRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: ServiceEntry): Promise<Result<GetRandomPromotionResponseApplicationDto>> {
        const promotionResult: Result<Promotion> = await this.promotionRepository.findRandomPromotion();
        
        if (!promotionResult.IsSuccess) {
            return Result.fail(null, promotionResult.statusCode, promotionResult.message, promotionResult.error);
        }

        const imageResult: Result<Buffer> = await this.getBufferImage.getFile(promotionResult.Data.ImageRef.Path);
        if (!imageResult.IsSuccess) {
            return Result.fail(null, imageResult.statusCode, imageResult.message, imageResult.error);
        }

        const response: GetRandomPromotionResponseApplicationDto = {
            userId: param.userId,
            promotion: promotionResult.Data,
            image: imageResult.Data
        }
        return Result.success(response, 200);
    }
}