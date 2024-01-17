import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { SubscriptionChanel } from 'src/subscription/domain/subscription-chanel/subscription-chanel';
import { OrmSubscriptionChanelEntity } from '../../persistence-entities/orm-entities/orm-subscription-chanel.entity';
import { SubscriptionChanelId } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id';
import { SubscriptionChanelName } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-name';
import { SubscriptionChanelType } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-type';
import { SubscriptionChanelUrlValidation } from 'src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-url-validation';
import { SubscriptionChanelTypeEnum } from 'src/subscription/domain/subscription-chanel/enum/subscription-chanel-type.enum';

export class OrmSubscriptionChanelMapper
  implements IMapper<SubscriptionChanel, OrmSubscriptionChanelEntity>
{
  async toDomain(
    persistence: OrmSubscriptionChanelEntity,
  ): Promise<SubscriptionChanel> {
    if (persistence) {
      const subscriptionChanel: SubscriptionChanel = SubscriptionChanel.create(
        SubscriptionChanelId.create(persistence.codigo_canal),
        SubscriptionChanelName.create(persistence.nombre),
        SubscriptionChanelType.create(
          SubscriptionChanelTypeEnum[persistence.tipo],
        ),
        SubscriptionChanelUrlValidation.create(persistence.url),
      );
      return subscriptionChanel;
    }

    return null;
  }

  async toPersistence(
    domain: SubscriptionChanel,
  ): Promise<OrmSubscriptionChanelEntity> {
    if (domain){
      const subscriptionChanel = OrmSubscriptionChanelEntity.create(
        domain.Id.Id,
        domain.Name.Name,
        domain.Type.Type,
        domain.UrlValidation.Url
      );
      return subscriptionChanel;
    }
    return null;
  }
}
