import { UuidGenerator } from "src/common/infrastructure/uuid-generator";
import { SubscriptionStatusEnum } from "src/subscription/domain/enums/subscription-status.enum";
import { Subscription } from "src/subscription/domain/subscription";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";
import { SubscriptionCreatedDate } from "src/subscription/domain/value-objects/subscription-created-date";
import { SubscriptionEndDate } from "src/subscription/domain/value-objects/subscription-end-date";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";
import { SubscriptionStatus } from "src/subscription/domain/value-objects/subscription-status";
import { SubscriptionValue } from "src/subscription/domain/value-objects/subscription-value";
import { SubscriptionUserId } from "src/subscription/domain/value-objects/suscription-user-id";
import { UserId } from "src/user/domain/value-objects/user-id";

export class SubscriptionObjectMother{
    static createRandomSubscription(id: string){
        const idGenerator = new UuidGenerator()
        const subscription = Subscription.create(
            SubscriptionId.create(idGenerator.generate()),
            SubscriptionStatus.create(SubscriptionStatusEnum.ACTIVE),
            SubscriptionCreatedDate.create(new Date()),
            SubscriptionEndDate.create(new Date()),
            SubscriptionValue.create('4123684719'),
            UserId.create(id),
            SubscriptionChanelId.create('123456789'), 
        )
        return subscription
    }
}