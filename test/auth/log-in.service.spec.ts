import { LogInEntryApplicationDto } from "src/auth/application/dto/entry/log-in-entry.application.dto";
import { LoginApplicationService } from "src/auth/application/services/log-in-service.application.service";
import { SubscriptionObjectMother } from "test/common/objects-mother/subscription.object-mother";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { JwtGeneratorMock } from "test/common/others-mocks/jwt-generator.mock";
import { SubscriptionRepositoryMock } from "test/common/repository-mocks/subscription.repository.mock";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";

describe('LogInService', () => {

    it('Inicia sesion correctamente correctamente', async () => {
      const userRepository = UserRepositoryMock.create();
      const user = await UserObjectMother.createNormalUser();
      userRepository.saveAggregate(user);
      const subscription = await SubscriptionObjectMother.createRandomSubscription(user.Id.Id);
      const subscriptionRepository = SubscriptionRepositoryMock.create();
      subscriptionRepository.saveAggregate(subscription);
      const jwtGenerator = JwtGeneratorMock.create();
      const dto: LogInEntryApplicationDto = { userId: 'Unknown', phone: subscription.SubscriptionValue.SubscriptionValue, token: '543216598732148654'}
      const service = new LoginApplicationService(subscriptionRepository, userRepository, jwtGenerator);

      const result = await service.execute(dto)

      expect(result.IsSuccess).toBeTruthy()
    })

    it('No hay una suscripcion asociada al numero', async () => {
        const userRepository = UserRepositoryMock.create();
        const subscriptionRepository = SubscriptionRepositoryMock.create();
        const jwtGenerator = JwtGeneratorMock.create();
        const dto: LogInEntryApplicationDto = { userId: 'Unknown', phone: '4123684719', token: '543216598732148654'}
        const service = new LoginApplicationService(subscriptionRepository, userRepository, jwtGenerator);

        const result = await service.execute(dto)

        expect(result.IsSuccess).toBeFalsy()
    })
})