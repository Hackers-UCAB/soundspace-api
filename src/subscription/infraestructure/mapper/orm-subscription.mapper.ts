import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { OrmSubscripcionEntity } from "../orm-entities/subscription.entity";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";
import { SubscriptionStatusEnum } from "src/subscription/domain/enums/subscription-status.enum";
import { SubscriptionStatus } from "src/subscription/domain/value-objects/subscription-status";
import { SubscriptionCreatedDate } from "src/subscription/domain/value-objects/subscription-created-date";
import { SubscriptionEndDate } from "src/subscription/domain/value-objects/subscription-end-date";
import { UserId } from "src/user/domain/value-objects/user-id";


export class OrmSubscriptionMapper implements IMapper<Subscription, OrmSubscripcionEntity>{
    async toDomain(persistence: OrmSubscripcionEntity): Promise<Subscription> {
        if(persistence){
            
            const subscription: Subscription = Subscription.create(
                SubscriptionId.create(persistence.codigo_subscripcion),
                SubscriptionStatus.create(SubscriptionStatusEnum[persistence.status]),
                SubscriptionCreatedDate.create(persistence.fecha_creacion),
                SubscriptionEndDate.create(persistence.fecha_finalizacion),
                UserId.create(persistence.usuario.codigo_usuario)
            );

            return subscription;
        }
        return null;
    }
    
    async toPersistence(domain: Subscription): Promise<OrmSubscripcionEntity> {
        throw new Error("Method not implemented.");
    }
}