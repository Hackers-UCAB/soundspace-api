import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { SignUpDigitelApplicationService } from "src/auth/application/services/sign-up-digitel-service.application.service";
import { UserRepository } from '../../src/user/infraestructure/repositories/user.repository';
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";
import { SubscriptionRepositoryMock } from '../common/repository-mocks/subscription.repository.mock';
import { UuidGeneratorMock } from "test/common/others-mocks/uuid-generator.mock";
import { JwtGeneratorMock } from "test/common/others-mocks/jwt-generator.mock";
import { DigitelSubscriptionValidationMock } from "test/common/others-mocks/digitel-subscription-validation.mock";
import { EventBus } from '../../src/common/infraestructure/events/event-bus';
import { SignUpEntryApplicationDto } from "src/auth/application/dto/entrys/sign-up-entry.application.dto";




describe('SignUpDigitelService', () => {
    it('Se registra correctamente', async () => {
      //arrange
      const userRepositoryMock = UserRepositoryMock.create();
      const subscriptionRepositoryMock = SubscriptionRepositoryMock.create();
      const uuidGeneratorMock = UuidGeneratorMock.create();
      const jwtGeneratorMock = JwtGeneratorMock.create();
      const digitelSubscriptionValidationMock = DigitelSubscriptionValidationMock.create();
      const eventBus = new EventBus() 

      const dto: SignUpEntryApplicationDto = {
          phone: '4123684719',
          token: 'token',
          userId: 'Unknown',
      }
      
      const service = new SignUpDigitelApplicationService(
        userRepositoryMock,
        subscriptionRepositoryMock,
        uuidGeneratorMock,
        digitelSubscriptionValidationMock,
        jwtGeneratorMock,
        eventBus)

      //act
      const result = await service.execute(dto)
      //assert
      expect(result.IsSuccess).toBeTruthy()
  })
})