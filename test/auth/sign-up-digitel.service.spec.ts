import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { SignUpDigitelApplicationService } from "src/auth/application/services/sign-up-digitel-service.application.service";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";
import { SubscriptionRepositoryMock } from '../common/repository-mocks/subscription.repository.mock';
import { UuidGeneratorMock } from "test/common/others-mocks/uuid-generator.mock";
import { JwtGeneratorMock } from "test/common/others-mocks/jwt-generator.mock";
import { DigitelSubscriptionValidationMock } from "test/common/others-mocks/digitel-subscription-validation.mock";
import { EventBus } from "src/common/infrastructure/events/event-bus";
import { SignUpEntryApplicationDto } from "src/auth/application/dto/entry/sign-up-entry.application.dto";
import { EventBusStub } from "test/common/others-mocks/event-bus.stub";


describe('SignUpDigitelService', () => {
    it('Se registra correctamente', async () => {
      const userRepositoryMock = UserRepositoryMock.create();
      const subscriptionRepositoryMock = SubscriptionRepositoryMock.create();
      const uuidGeneratorMock = UuidGeneratorMock.create();
      const jwtGeneratorMock = JwtGeneratorMock.create();
      const digitelSubscriptionValidationMock = DigitelSubscriptionValidationMock.create();
      const eventBus = new EventBusStub() 
      const dto: SignUpEntryApplicationDto = { phone: '4123684719', token: 'token', userId: 'Unknown'}
      const service = new SignUpDigitelApplicationService(
        userRepositoryMock,
        subscriptionRepositoryMock,
        uuidGeneratorMock,
        digitelSubscriptionValidationMock,
        jwtGeneratorMock,
        eventBus)

      const result = await service.execute(dto)

      expect(result.IsSuccess).toBeTruthy()
  })

  it('El numero no es valido', async () => {
    const userRepositoryMock = UserRepositoryMock.create();
    const subscriptionRepositoryMock = SubscriptionRepositoryMock.create();
    const uuidGeneratorMock = UuidGeneratorMock.create();
    const jwtGeneratorMock = JwtGeneratorMock.create();
    const digitelSubscriptionValidationMock = DigitelSubscriptionValidationMock.create();
    const eventBus = new EventBusStub() 
    const dto: SignUpEntryApplicationDto = { phone: '4123684719221', token: 'token', userId: 'Unknown'}
    const service = new SignUpDigitelApplicationService(
      userRepositoryMock,
      subscriptionRepositoryMock,
      uuidGeneratorMock,
      digitelSubscriptionValidationMock,
      jwtGeneratorMock,
      eventBus)

    const result = await service.execute(dto)

    expect(result.IsSuccess).toBeFalsy()
  })
})