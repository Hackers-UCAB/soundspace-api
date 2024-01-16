
import { Result } from "src/common/domain/result-handler/result";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";
import { SubscriptionValue } from "src/subscription/domain/value-objects/subscription-value";
import { UserId } from "src/user/domain/value-objects/user-id";


export class SubscriptionRepositoryMock implements ISubscriptionRepository {
    
    private readonly subscriptions: Subscription[] = [];

    async findSubscriptionById(id: SubscriptionId): Promise<Subscription> {
        for (let i = 0; i < this.subscriptions.length; i++) {
            const subscription = this.subscriptions[i];
            if (subscription.Id.equals(id)) { return subscription ; }
        }
    }
    async saveAggregate(subscription: Subscription): Promise<Result<string>> {
        this.subscriptions.push(subscription);
        return Result.success('Suscripcion agregada de forma exitosa', 200)
    }

    async findSubscriptionByValue(value: SubscriptionValue): Promise<Result<Subscription>> {
        for (let i = 0; i < this.subscriptions.length; i++) {
            const subscription = this.subscriptions[i];
            if (subscription.SubscriptionValue.equals(value)) { return Result.success(subscription, 200) ; }
        }
    }

    findSubscriptionsExpiringOnDate(endDate: Date): Promise<Result<Subscription[]>> {
        throw new Error("Method not implemented.");
    }
    findSubscriptionByUser(id: UserId): Promise<Result<Subscription>> {
        throw new Error("Method not implemented.");
    }
    findSubscriptionChanelById(id: SubscriptionChanelId): Promise<Result<SubscriptionChanel>> {
        throw new Error("Method not implemented.");
    }
   
    static create(){
        return new SubscriptionRepositoryMock()
    }
    
}