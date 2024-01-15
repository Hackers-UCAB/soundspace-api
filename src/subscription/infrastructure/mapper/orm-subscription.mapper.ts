import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { OrmSubscripcionEntity } from '../orm-entities/subscription.entity';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatusEnum } from 'src/subscription/domain/enums/subscription-status.enum';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { SubscriptionCreatedDate } from 'src/subscription/domain/value-objects/subscription-created-date';
import { SubscriptionEndDate } from 'src/subscription/domain/value-objects/subscription-end-date';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { OrmUserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { OrmUserMapper } from 'src/user/infrastructure/mapper/orm-user.mapper';
import { OrmSubscriptionChanelMapper } from './orm-subscription-chanel.mapper';

export class OrmSubscriptionMapper
  implements IMapper<Subscription, OrmSubscripcionEntity>
{
  private readonly dataSource: DataSource;
  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }
  async toDomain(persistence: OrmSubscripcionEntity): Promise<Subscription> {
    if (persistence) {
      const subscription: Subscription = await Subscription.create(
        SubscriptionId.create(persistence.codigo_subscripcion),
        SubscriptionStatus.create(SubscriptionStatusEnum[persistence.status]),
        SubscriptionCreatedDate.create(persistence.fecha_creacion),
        SubscriptionEndDate.create(persistence.fecha_finalizacion),
        SubscriptionValue.create(persistence.value),
        UserId.create(persistence.usuario.codigo_usuario),
        SubscriptionChanelId.create(persistence.canal.codigo_canal),
      );

      return subscription;
    }
    return null;
  }

  async toPersistence(domain: Subscription): Promise<OrmSubscripcionEntity> {
    if (domain) {
      //TODO: Ver como puedo arreglar esta vaina
      const subscription = await OrmSubscripcionEntity.create(
        domain.Id.Id,
        domain.Status.Status,
        domain.CreatedOn.Date,
        domain.Until.Date,
        domain.SubscriptionValue.SubscriptionValue,
        domain.User.Id,
        new UserRepository(this.dataSource, new OrmUserMapper()),
        domain.Chanel.Id,
        new SubscriptionRepository(this.dataSource, this, new OrmSubscriptionChanelMapper()),
      );
      return subscription;
    }
    return null;
  }
}
