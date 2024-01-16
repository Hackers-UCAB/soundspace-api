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
    odmSubscriptionChanelMapper: IMapper<SubscriptionChanel, OdmSubscriptionChanelEntity>,
  ){
    this.subscriptionModel = subscriptionModel;
    this.subscriptionChanelModel = subscriptionChanelModel;
    this.odmSubscriptionMapper = odmSubscriptionMapper;
    this.odmSubscriptionChanelMapper = odmSubscriptionChanelMapper;
  }
  findSubscriptionById(id: SubscriptionId): Promise<Subscription> {
    throw new Error('Method not implemented.');
  }
  saveAggregate(subscription: Subscription): Promise<Result<string>> {
    throw new Error('Method not implemented.');
  }
  findSubscriptionByValue(
    value: SubscriptionValue,
  ): Promise<Result<Subscription>> {
    throw new Error('Method not implemented.');
  }
  findSubscriptionsExpiringOnDate(
    endDate: Date,
  ): Promise<Result<Subscription[]>> {
    throw new Error('Method not implemented.');
  }
  findSubscriptionByUser(id: UserId): Promise<Result<Subscription>> {
    throw new Error('Method not implemented.');
  }
  findSubscriptionChanelById(
    id: SubscriptionChanelId,
  ): Promise<Result<SubscriptionChanel>> {
    throw new Error('Method not implemented.');
  }
}
