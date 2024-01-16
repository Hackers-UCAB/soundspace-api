import { IMapper } from "src/common/application/mappers/mapper.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { OdmSubscriptionChanelEntity } from "../../persistence-entities/odm-entities/odm-subscription-chanel.entity";


export class OdmSubscriptionChanelMapper implements IMapper<SubscriptionChanel, OdmSubscriptionChanelEntity>{
    toDomain(persistence: OdmSubscriptionChanelEntity): Promise<SubscriptionChanel> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: SubscriptionChanel): Promise<OdmSubscriptionChanelEntity> {
        throw new Error("Method not implemented.");
    }
}