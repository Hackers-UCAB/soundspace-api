import { IMapper } from "src/common/application/mappers/mapper.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { OdmSubscriptionChanelEntity } from "../../persistence-entities/odm-entities/odm-subscription-chanel.entity";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionChanelName } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-name";
import { SubscriptionChanelType } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-type";
import { SubscriptionChanelUrlValidation } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-url-validation";
import { SubscriptionChanelTypeEnum } from "src/subscription/domain/subscription-chanel/enum/subscription-chanel-type.enum";


export class OdmSubscriptionChanelMapper implements IMapper<SubscriptionChanel, OdmSubscriptionChanelEntity>{
    async toDomain(persistence: OdmSubscriptionChanelEntity): Promise<SubscriptionChanel> {
        if (persistence){
            const subscriptionChanel: SubscriptionChanel = SubscriptionChanel.create(
                SubscriptionChanelId.create(persistence._id), 
                SubscriptionChanelName.create(persistence.nombre), 
                SubscriptionChanelType.create(SubscriptionChanelTypeEnum[persistence.tipo]), 
                SubscriptionChanelUrlValidation.create(persistence.url)
            );
            return subscriptionChanel;
        }
        return null;
    }
    toPersistence(domain: SubscriptionChanel): Promise<OdmSubscriptionChanelEntity> {
        throw new Error("Method not implemented.");
    }
}