import { Subscription } from "../subscription";
import { SubscriptionId } from "../value-objects/subscription-id";

  

export interface ISubscriptionRepository{
    findAll(): any;
    findSubscriptionById(id: SubscriptionId): Promise<Subscription>
    saveSubscription(subscription: Subscription) : Promise<string>;
}