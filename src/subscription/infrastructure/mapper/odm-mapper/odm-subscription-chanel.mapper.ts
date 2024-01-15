import { IMapper } from "src/common/application/mappers/mapper.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { OdmSubscriptionChanel } from "../../persistence-entities/odm-entities/odm-subscription-chanel.entity";


export class OdmSubscriptionChanelMapper implements IMapper<SubscriptionChanel, OdmSubscriptionChanel>{
    toDomain(persistence: OdmSubscriptionChanel): Promise<SubscriptionChanel> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: SubscriptionChanel): Promise<OdmSubscriptionChanel> {
        throw new Error("Method not implemented.");
    }
}