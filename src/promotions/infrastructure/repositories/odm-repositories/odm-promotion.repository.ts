import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { Promotion } from "src/promotions/domain/promotion";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";
import { OdmPromotionEntity } from "../../persistence-entities/odm-entities/odm-promotion.entity";
import { Model } from "mongoose";


export class OdmPromotionRepository implements IPromotionRepository{
    private readonly odmPromotionMapper: IMapper<Promotion, OdmPromotionEntity>;
    private readonly promotionModel: Model<OdmPromotionEntity>;

    constructor(
        odmPromotionMapper: IMapper<Promotion, OdmPromotionEntity>,
        promotionModel: Model<OdmPromotionEntity>
    ){
        this.odmPromotionMapper = odmPromotionMapper;
        this.promotionModel = promotionModel;
    }
    saveAggregate(promotion: Promotion): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    async findRandomPromotion(): Promise<Result<Promotion>> {
        let response: Promotion;
        let error : any;
        try {
            const promotion = await this.promotionModel
            .aggregate([{ $sample: { size: 1 } }])
            .exec();
            response = await this.odmPromotionMapper.toDomain(promotion[0]);
        } catch (err) {
            error = err;
        }finally{
            if(error){
                return Result.fail(
                    null,
                    500,
                    'Error al buscar o mapear la promocion',
                    error
                );
            }
            if(!response){
                return Result.fail(
                    null,
                    404,
                    'No existen promociones',
                    new Error('No existen promociones')
                );
            }
            return Result.success(response, 200);
        }
    }
    
}