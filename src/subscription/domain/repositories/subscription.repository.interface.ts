import { Result } from "src/common/application/result-handler/result";
import { Subscription } from "../subscription";
import { SubscriptionId } from "../value-objects/subscription-id";
import { SubscriptionValue } from "../value-objects/subscription-value";

  

export interface ISubscriptionRepository{
    findAll(): any;
    findSubscriptionById(id: SubscriptionId): Promise<Subscription>
    saveAggregate(subscription: Subscription) : Promise<Result<string>>;
    findSubscriptionByValue(value: SubscriptionValue): Promise<Subscription>;
    findSubscriptionsByEndDate(endDate: Date): Promise<Result<Subscription[]>>;
}