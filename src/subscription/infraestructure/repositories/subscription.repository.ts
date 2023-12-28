import {
  DataSource,
  EntityNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { OrmSubscripcionEntity } from '../orm-entities/subscription.entity';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { OrmSubscriptionMapper } from '../mapper/orm-subscription.mapper';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { Result } from 'src/common/application/result-handler/result';

export class SubscriptionRepository
  extends Repository<OrmSubscripcionEntity>
  implements ISubscriptionRepository
{
  private readonly ormSubscriptionMapper: OrmSubscriptionMapper;

  constructor(dataSource: DataSource) {
    super(OrmSubscripcionEntity, dataSource.createEntityManager());
    this.ormSubscriptionMapper = new OrmSubscriptionMapper(dataSource);
  }

  async findSubscriptionEntityById(id: string): Promise<OrmSubscripcionEntity> {
    try {
      const subscription = await this.findOne({
        where: {
          codigo_subscripcion: id,
        },
        relations: {
          usuario: true,
          canal: true,
        },
      });
      return subscription;
    } catch (error) {
      return null;
    }
  }

  async findSubscriptionById(id: SubscriptionId): Promise<Subscription> {
    const subscription = await this.findOne({
      where: {
        codigo_subscripcion: id.Id,
      },
      relations: {
        usuario: true,
      },
    });
    return this.ormSubscriptionMapper.toDomain(subscription);
  }

  async saveAggregate(subscription: Subscription): Promise<Result<string>> {
    let error: any;
    try {
      const ormSubscription =
        await this.ormSubscriptionMapper.toPersistence(subscription);
      await this.save(ormSubscription);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado creando la subscripcion, hable con el administrador',
          error,
        );
      }
      return Result.success('Subscripción registrada de forma exitosa', 200);
    }
  }

  async findSubscriptionByValue(
    value: SubscriptionValue,
  ): Promise<Result<Subscription>> {
    let response: Subscription;
    let error: any;
    try {
      const subscription = await this.findOne({
        where: {
          value: value.SubscriptionValue,
        },
        relations: {
          usuario: true,
          canal: true,
        },
      });
      response = await this.ormSubscriptionMapper.toDomain(subscription);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          'Error al buscar o mapear la subscripción',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }

  async findSubscriptionsExpiringOnDate(
    endDate: Date,
  ): Promise<Result<Subscription[]>> {
    let response: Subscription[];
    let error: any;
    try {
      const date = endDate.toISOString().split('T')[0];
      const subscriptions: OrmSubscripcionEntity[] =
        await this.createQueryBuilder('subscripcion')
          .leftJoinAndSelect('subscripcion.usuario', 'usuario')
          .leftJoinAndSelect('subscripcion.canal', 'canal')
          .where(`DATE_TRUNC('day', fecha_finalizacion) = :date`, { date })
          .getMany();
      
      response = await Promise.all(
        subscriptions.map(
          async (subscription) =>
            await this.ormSubscriptionMapper.toDomain(subscription),
        ),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          'Error al buscar o mapear las subscripciones',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }

}
