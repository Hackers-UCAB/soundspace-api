import { DataSource, EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
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

  findAll() {
    throw new Error('Method not implemented.');
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
      const subscription = await this.findOne({
        where: {
          value: value.SubscriptionValue,
        },
        relations: {
          usuario: true,
        },
        
      });
      const domainSub = await this.ormSubscriptionMapper.toDomain(subscription);
      return Result.success<Subscription>(domainSub,200);
  }

  //TODO: Revisar si hice esto bien
  async findSubscriptionsByEndDate(endDate: Date): Promise<Result<Subscription[]>> {
    try {
        const subscriptions: OrmSubscripcionEntity[] = await this.find({
            where: {
                fecha_finalizacion: endDate
            },
            relations: {
                usuario: true
            }
        });

        const domainSubscriptions: Subscription[] = await Promise.all(subscriptions.map((subscription) => this.ormSubscriptionMapper.toDomain(subscription)));

        return Result.success<Subscription[]>(domainSubscriptions, 200);
    } catch (error) {
        const errorHandled = this.handleError(error);
        return Result.fail<Subscription[]>(null, 500, errorHandled.message, errorHandled);
    }
  }

  //podria abstraerse en algun lugar si decidimos usarlo o algo por el estilo
  handleError(error: any): Error {
    if (error instanceof QueryFailedError){
        return Error('Query failed');
    } else if (error instanceof EntityNotFoundError) {
        return Error('Entity not found');
    } else {
        return Error('Unknown error');
    }
}
}
