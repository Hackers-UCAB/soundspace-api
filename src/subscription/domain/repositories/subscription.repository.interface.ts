import { Result } from "src/common/application/result-handler/result";
import { Subscription } from "../subscription";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionValue } from "../value-objects/subscription-value";
import { SubscriptionChanelId } from "../subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionChanel } from "../subscription-chanel/subscription-chanel";
import { UserId } from "src/user/domain/value-objects/user-id";

  

export interface ISubscriptionRepository{
    findSubscriptionById(id: SubscriptionId): Promise<Subscription>
    saveAggregate(subscription: Subscription) : Promise<Result<string>>;
    findSubscriptionByValue(value: SubscriptionValue): Promise<Result<Subscription>>;
    findSubscriptionsExpiringOnDate(endDate: Date): Promise<Result<Subscription[]>>;
    findSubscriptionByUser(id: UserId): Promise<Result<Subscription>>
    findSubscriptionChanelById(id : SubscriptionChanelId): Promise<Result<SubscriptionChanel>>;
}