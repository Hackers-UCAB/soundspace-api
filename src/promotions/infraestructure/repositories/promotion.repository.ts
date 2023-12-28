import { IPromotionRepository } from 'src/promotions/domain/repositories/promotion.repository.interface';
import { OrmPromotionEntity } from '../orm-entities/promotion.entity';
import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { Promotion } from 'src/promotions/domain/promotion';
import { OrmPromotionMapper } from '../mapper/orm-promotion.mapper';

export class PromotionRepository
  extends Repository<OrmPromotionEntity>
  implements IPromotionRepository
{
  private readonly ormPromotionMapper: OrmPromotionMapper;

  constructor(dataSource: DataSource) {
    super(OrmPromotionEntity, dataSource.createEntityManager());
    this.ormPromotionMapper = new OrmPromotionMapper();
  }

  saveAggregate(promotion: Promotion): Promise<Result<string>> {
    throw new Error('Method not implemented.');
  }
  async findRandomPromotion(): Promise<Result<Promotion>> {
    let response: Promotion;
    let error: any;
    try {
      const promotion = await this.createQueryBuilder()
        .select()
        .orderBy('RANDOM()')
        .getOne();
      response = await this.ormPromotionMapper.toDomain(promotion);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          'Error al buscar o mapear la promoción',
          error,
        );
      }

      if (!response) {
        return Result.fail(
          null,
          404,
          'No existen promociones',
          new Error('No existen promociones'),
        );
      }
      return Result.success(response, 200);
    }
  }
}
