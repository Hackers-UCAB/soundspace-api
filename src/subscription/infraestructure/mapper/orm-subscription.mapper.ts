import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Subscription } from 'src/subscription/domain/subscription';
import { OrmSubscripcionEntity } from '../orm-entities/subscription.entity';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatusEnum } from 'src/subscription/domain/enums/subscription-status.enum';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { SubscriptionCreatedDate } from 'src/subscription/domain/value-objects/subscription-created-date';
import { SubscriptionEndDate } from 'src/subscription/domain/value-objects/subscription-end-date';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { OrmUserEntity } from 'src/user/infraestructure/orm-entities/user.entity';
import { SubscriptionValue } from 'src/subscription/domain/value-objects/subscription-value';

export class OrmSubscriptionMapper
  implements IMapper<Subscription, OrmSubscripcionEntity>
{
  async toDomain(persistence: OrmSubscripcionEntity): Promise<Subscription> {
    if (persistence) {
      const subscription: Subscription = Subscription.create(
        SubscriptionId.create(persistence.codigo_subscripcion),
        SubscriptionStatus.create(SubscriptionStatusEnum[persistence.status]),
        SubscriptionCreatedDate.create(persistence.fecha_creacion),
        SubscriptionEndDate.create(persistence.fecha_finalizacion),
        SubscriptionValue.create(persistence.value),
        UserId.create(persistence.usuario.codigo_usuario),
      );

      return subscription;
    }
    return null;
  }

  async toPersistence(domain: Subscription): Promise<OrmSubscripcionEntity> {
    if (domain) {
      const subscription = OrmSubscripcionEntity.create(
        domain.Id.Id,
        domain.Status.Status,
        domain.CreatedOn.Date,
        domain.Until.Date,
        domain.SubscriptionValue.SubscriptionValue,
        //domain.User.Id.Id
        //OrmUserEntity.create(domain.User.Id.Id),
      );
      return subscription;
    }

    return null;
  }
}
