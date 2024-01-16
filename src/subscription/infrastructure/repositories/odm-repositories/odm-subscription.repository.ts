import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { OdmSubscriptionEntity } from '../../persistence-entities/odm-entities/odm-subscription.entity';
import { OdmSubscriptionChanelEntity } from '../../persistence-entities/odm-entities/odm-subscription-chanel.entity';
import { Model } from 'mongoose';

export class OdmSubscriptionRepository implements ISubscriptionRepository {
  private readonly subscriptionModel: Model<OdmSubscriptionEntity>;
  private readonly subscriptionChanelModel: Model<OdmSubscriptionChanelEntity>;
  private readonly odmSubscriptionMapper: IMapper<
    Subscription,
    OdmSubscriptionEntity
  >;
  private readonly odmSubscriptionChanelMapper: IMapper<
    SubscriptionChanel,
    OdmSubscriptionChanelEntity
  >;

  constructor(
    subscriptionModel: Model<OdmSubscriptionEntity>,
    subscriptionChanelModel: Model<OdmSubscriptionChanelEntity>,
    odmSubscriptionMapper: IMapper<Subscription, OdmSubscriptionEntity>,
    odmSubscriptionChanelMapper: IMapper<
      SubscriptionChanel,
      OdmSubscriptionChanelEntity
    >,
  ) {
    this.subscriptionModel = subscriptionModel;
    this.subscriptionChanelModel = subscriptionChanelModel;
    this.odmSubscriptionMapper = odmSubscriptionMapper;
    this.odmSubscriptionChanelMapper = odmSubscriptionChanelMapper;
  }
  findSubscriptionById(id: SubscriptionId): Promise<Subscription> {
    throw new Error('Method not implemented.');
  }
  async saveAggregate(subscription: Subscription): Promise<Result<string>> {
    let error: any;
    try {
      const odmSubscription =
        await this.odmSubscriptionMapper.toPersistence(subscription);
      const existingSubscription = await this.subscriptionModel.findOne({
        codigo_subscripcion: odmSubscription.codigo_subscripcion,
      });

      if (existingSubscription) {
        if  (odmSubscription.status) existingSubscription.status = odmSubscription.status
        await existingSubscription.updateOne(existingSubscription);
      } else {
        await this.subscriptionModel.create(odmSubscription);
      }
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado creando el usuario, hable con el administrador',
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
      const subscription = await this.subscriptionModel.findOne({
        value: value.SubscriptionValue,
      });
      response = await this.odmSubscriptionMapper.toDomain(subscription);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe una subscripción con ese valor',
          new Error('No existe una subscripción con ese valor'),
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

      const subscriptions = await this.subscriptionModel.aggregate([
        {
          $project: {
            fecha_finalizacion_string: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$fecha_finalizacion',
              },
            },
            fecha_finalizacion: 1, // este es el campo original
            codigo_subscripcion: 1,
            fecha_creacion: 1,
            value: 1,
            status: 1,
            usuario: 1,
            canal: 1,
          },
        },
        {
          $match: {
            fecha_finalizacion_string: date,
          },
        },
      ]);
      response = await Promise.all(
        subscriptions.map(async (subscription) => {
          return await this.odmSubscriptionMapper.toDomain(subscription);
        }),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message || 'Error al buscar o mapear las subscripciones',
          error,
        );
      }
      return Result.success(response, 200);
    }
  }

  async findSubscriptionByUser(id: UserId): Promise<Result<Subscription>> {
    let error: any;
    let response: Subscription;
    try {
      const subscription = await this.subscriptionModel.findOne({
        usuario: id.Id
      });
      response = await this.odmSubscriptionMapper.toDomain(subscription);
    } catch (err) {
      error = err;
    }finally{
      if (error) {
        return Result.fail(
          null,
          500,
          error.message || 'Error al buscar o mapear las subscripciones',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe una subscripción con ese valor',
          new Error('No existe una subscripción con ese valor'),
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
      const subscriptionChanel = await this.subscriptionChanelModel.findOne({
        codigo_canal: id.Id,
      });

      response =
        await this.odmSubscriptionChanelMapper.toDomain(subscriptionChanel);
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
          'No existe el canal de subscripcion solicitado',
          new Error('No existe el canal de subscripcion solicitado'),
        );
      }
      return Result.success(response, 200);
    }
  }
}
