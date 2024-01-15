import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { OdmSubscriptionEntity } from "../../persistence-entities/odm-entities/odm-subscription.entity";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionCreatedDate } from "src/subscription/domain/value-objects/subscription-created-date";
import { SubscriptionEndDate } from "src/subscription/domain/value-objects/subscription-end-date";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";
import { SubscriptionStatus } from "src/subscription/domain/value-objects/subscription-status";
import { SubscriptionValue } from "src/subscription/domain/value-objects/subscription-value";
import { UserId } from "src/user/domain/value-objects/user-id";
import { SubscriptionStatusEnum } from "../../persistence-entities/orm-entities/orm-subscription.entity";


export class OdmSubscriptionMapper implements IMapper<Subscription, OdmSubscriptionEntity>{
    async toDomain(persistence: OdmSubscriptionEntity): Promise<Subscription> {
        if (persistence){
            const subscription: Subscription = await Subscription.create(
                SubscriptionId.create(persistence.codigo_subscripcion),
                SubscriptionStatus.create(SubscriptionStatusEnum[persistence.status]),
                SubscriptionCreatedDate.create(persistence.fecha_creacion),
                SubscriptionEndDate.create(persistence.fecha_finalizacion),
                SubscriptionValue.create(persistence.value),
                UserId.create(persistence.usuario),
                SubscriptionChanelId.create(persistence.canal),
            );
            return subscription;
        }
        return null;
    }
    toPersistence(domain: Subscription): Promise<OdmSubscriptionEntity> {
        throw new Error("Method not implemented.");
    }
    
}