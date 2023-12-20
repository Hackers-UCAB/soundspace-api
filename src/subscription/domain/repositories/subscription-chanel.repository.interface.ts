import { OrmSubscriptionChanelEntity } from "src/subscription/infraestructure/orm-entities/subscription-chanel.entity";
import { SubscriptionChanel } from "../subscription-chanel/subscription-chanel";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";
import { Result } from "src/common/application/result-handler/result";

export interface ISubscriptionChanelRepository{
    findSubscriptionChanelById(id : SubscriptionChanelId): Promise<Result<SubscriptionChanel>>;
    findSubscriptionChanelEntityById(id: string): Promise<OrmSubscriptionChanelEntity>
}