import { DataSource, Repository } from 'typeorm';
import { OrmSubscripcionEntity } from '../orm-entities/subscription.entity';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { OrmSubscriptionMapper } from '../mapper/orm-subscription.mapper';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { Result } from 'src/common/application/result-handler/result';
import { OrmSubscriptionChanelMapper } from '../mapper/orm-subscription-chanel.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { OrmSubscriptionChanelEntity } from '../orm-entities/subscription-chanel.entity';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';
import { UserId } from 'src/user/domain/value-objects/user-id';

export class SubscriptionRepository
  extends Repository<OrmSubscripcionEntity>
  implements ISubscriptionRepository
{
  private readonly ormSubscriptionMapper: OrmSubscriptionMapper;
  private readonly ormSubscriptionChanelMapper: OrmSubscriptionChanelMapper;
  private readonly subscriptionChanelRepository: Repository<OrmSubscriptionChanelEntity>;
  constructor(
    dataSource: DataSource,
  ) {
    super(OrmSubscripcionEntity, dataSource.createEntityManager());
    this.ormSubscriptionMapper = new OrmSubscriptionMapper(dataSource);
    this.ormSubscriptionChanelMapper = new OrmSubscriptionChanelMapper();
    this.subscriptionChanelRepository = dataSource.getRepository(
      OrmSubscriptionChanelEntity,
    );
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

  async findSubscriptionByUser(id: UserId): Promise<Result<Subscription>> {
    let response: Subscription;
    let error: any;
    try {
      const subscripcion = await this.findOne({
        where: {
          usuario: {
            codigo_usuario: id.Id,
          },
        },
        relations: {
          usuario: true,
          canal: true,
        },
      });
      response = await this.ormSubscriptionMapper.toDomain(subscripcion);
    } catch (err) {
      error = err;
    }finally{
      if (error) {
        return Result.fail(
          null,
          500,
          'Error al buscar o mapear la subscripción',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe la subscripción del usuario',
          new Error('No existe la subscripción del usuario'),
        );
      }
      return Result.success(response, 200);
    }
  }

  async findSubscriptionChanelById(
    id: SubscriptionChanelId,
  ): Promise<Result<SubscriptionChanel>> {
    let response: SubscriptionChanel;
    let error: any;
    try {
      const subscriptionChanel = await this.subscriptionChanelRepository.findOne({
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
      const subscriptionChanel = this.subscriptionChanelRepository.findOne({
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
