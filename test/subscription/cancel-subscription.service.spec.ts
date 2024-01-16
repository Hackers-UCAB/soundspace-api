import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { CancelSubscriptionApplicationService } from "src/subscription/application/services/cancel-subscription.application.service";
import { SubscriptionStatusEnum } from "src/subscription/infrastructure/orm-entities/subscription.entity";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { SubscriptionObjectMother } from "test/common/objects-mother/subscription.object-mother";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { SubscriptionRepositoryMock } from "test/common/repository-mocks/subscription.repository.mock";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";


describe('CancelSubscriptionService', () => {

    it('Se cancela correctamente', async () => {
        const subscriptionRepository = SubscriptionRepositoryMock.create();
        const userRepository = UserRepositoryMock.create();
        const user = await UserObjectMother.createNormalUser();
        userRepository.saveAggregate(user);
        const subscription = await SubscriptionObjectMother.createRandomSubscription(user.Id.Id);
        subscriptionRepository.saveAggregate(subscription);
        const service = new CancelSubscriptionApplicationService(subscriptionRepository, userRepository);
        const dto: ServiceEntry = { userId: user.Id.Id }

        const result = await service.execute(dto)

        expect(result.IsSuccess).toBeTruthy()
        expect(subscription.Status.Status).toEqual(SubscriptionStatusEnum.CANCELED)
        expect(user.Role.Role).toEqual(UserRoleEnum.GUEST)  
    })
})