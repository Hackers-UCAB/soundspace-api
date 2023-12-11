import { IIdGenerator } from "src/common/application/id-generator/id-generator.interface";
import { Result } from "src/common/application/result-handler/result";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { SubscriptionStatusEnum } from "src/subscription/domain/enums/subscription-status.enum";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { SubscriptionCreatedDate } from "src/subscription/domain/value-objects/subscription-created-date";
import { SubscriptionEndDate } from "src/subscription/domain/value-objects/subscription-end-date";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";
import { SubscriptionStatus } from "src/subscription/domain/value-objects/subscription-status";
import { SubscriptionValue } from "src/subscription/domain/value-objects/subscription-value";
import { UserId } from "src/user/domain/value-objects/user-id";

//TODO: Esto esta asi por los momentos pero hay que darle una vuelta
export class CreateSubscriptionService implements IApplicationService<string, string>{
    private readonly subscriptionRepository: ISubscriptionRepository;
    private readonly igGenerator: IIdGenerator<string>;

    constructor(repository: ISubscriptionRepository, igGenerator: IIdGenerator<string>){
        this.igGenerator = igGenerator;
        this.subscriptionRepository = repository;
    }

    async execute(param: string): Promise<Result<string>> {
        const subscription = Subscription.create(
            SubscriptionId.create(this.igGenerator.generate()),
            SubscriptionStatus.create(SubscriptionStatusEnum.ACTIVE),
            SubscriptionCreatedDate.create(new Date()),
            SubscriptionEndDate.create(new Date()),
            SubscriptionValue.create(param),
            UserId.create(param)
        );

        const result = await this.subscriptionRepository.saveSubscription(subscription);
        return Result.success(result, 200);
    }
    
}