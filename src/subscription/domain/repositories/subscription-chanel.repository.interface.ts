import { SubscriptionChanel } from "../subscription-chanel/subscription-chanel";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";

export interface ISubscriptionChanelRepository{
    findSubscriptionChanelById(id : SubscriptionChanelId): Promise<SubscriptionChanel>
}