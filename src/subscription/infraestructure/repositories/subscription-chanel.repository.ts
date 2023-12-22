import { DataSource, Repository } from 'typeorm';
import { OrmSubscriptionChanelEntity } from '../orm-entities/subscription-chanel.entity';
import { ISubscriptionChanelRepository } from 'src/subscription/domain/repositories/subscription-chanel.repository.interface';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { OrmSubscriptionChanelMapper } from '../mapper/orm-subscription-chanel.mapper';
import { Result } from 'src/common/application/result-handler/result';

export class SubscriptionChanelRepository
  extends Repository<OrmSubscriptionChanelEntity>
  implements ISubscriptionChanelRepository
{
  private readonly ormSubscriptionChanelMapper: OrmSubscriptionChanelMapper;
  constructor(dataSource: DataSource) {
    super(OrmSubscriptionChanelEntity, dataSource.createEntityManager());
    this.ormSubscriptionChanelMapper = new OrmSubscriptionChanelMapper();
  }

  async findSubscriptionChanelById(
    id: SubscriptionChanelId,
  ): Promise<Result<SubscriptionChanel>> {
    let response: SubscriptionChanel;
    let error: any;
    try {
      const subscriptionChanel = await this.findOne({
        where: {
          codigo_canal: id.Id,
        },
      });
      response =
        await this.ormSubscriptionChanelMapper.toDomain(subscriptionChanel);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          'Error al buscar o mapear el canal',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe el canal de subscripcion solicitado',
          new Error('No existe el canal de subscripcion solicitado'),
        );
      }
      return Result.success(response, 200);
    }
  }

  findSubscriptionChanelEntityById(
    id: string,
  ): Promise<OrmSubscriptionChanelEntity> {
    try {
      const subscriptionChanel = this.findOne({
        where: {
          codigo_canal: id,
        },
      });
      return subscriptionChanel;
    } catch (error) {
      return null;
    }
  }
}
