import { Result } from "src/common/application/result-handler/result";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";


export class FindSubscriptionService implements IApplicationService<string, Subscription>{
    private readonly subscriptionRepository: ISubscriptionRepository;

    constructor(repository: ISubscriptionRepository){
        this.subscriptionRepository = repository;
    }

    async execute(param: string): Promise<Result<Subscription>> {
        const subscription = await this.subscriptionRepository.findSubscriptionById(SubscriptionId.create(param));

        return Result.success(subscription, 200);
    }
    
}