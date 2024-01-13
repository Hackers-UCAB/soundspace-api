import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { SignUpDigitelApplicationService } from "src/auth/application/services/sign-up-digitel-service.application.service";
import { UserRepository } from '../../src/user/infraestructure/repositories/user.repository';
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";
import { SubscriptionRepositoryMock } from '../common/repository-mocks/subscription.repository.mock';
import { UuidGeneratorMock } from "test/common/others-mocks/uuid-generator.mock";
import { JwtGenerator } from '../../src/auth/infraestructure/jwt/jwt-generator';
import { JwtGeneratorMock } from "test/common/others-mocks/jwt-generator.mock";
import { DigitelSubscriptionValidationMock } from "test/common/others-mocks/digitel-subscription-validation.mock";
import { EventBus } from '../../src/common/infraestructure/events/event-bus';
import { AuditingRepositoryMock } from "test/common/repository-mocks/auditing.repository.mock";
import { LoggerMock } from "test/common/others-mocks/logger.mock";
import { logger } from "@azure/storage-blob";
import { SignUpEntryInfraestructureDto } from "src/auth/infraestructure/dto/entrys/sign-up-entry.infraestructure.dto";
import { SignUpEntryApplicationDto } from "src/auth/application/dto/entrys/sign-up-entry.application.dto";
import { Result } from '../../src/common/application/result-handler/result';


describe('SignUpDigitelService', () => {
    it('Se registra correctamente', async () => {
        //arrange
        const userRepositoryMock = new UserRepositoryMock();
        const subscriptionRepositoryMock = new SubscriptionRepositoryMock()
        const uuidGeneratorMock = new UuidGeneratorMock();
        const jwtGeneratorMock = new JwtGeneratorMock();
        const digitelSubscriptionValidationMock = new DigitelSubscriptionValidationMock()
        const eventBus = new EventBus() 
        const auditingRepositoryMock = new AuditingRepositoryMock()
        const loggerMock = new LoggerMock()
        const dto: SignUpEntryApplicationDto = {
            phone: '4123684719',
            token: 'token',
            userId: 'Unknown',
        }
        const service = new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new SignUpDigitelApplicationService(
                userRepositoryMock,
                subscriptionRepositoryMock,
                uuidGeneratorMock,
                digitelSubscriptionValidationMock,
                jwtGeneratorMock,
                eventBus,
              ),
              auditingRepositoryMock,
              'Digitel Sign-Up',
              loggerMock
            ),
            loggerMock,
            'Digitel Sign-Up',
          );
        //act
        const result = await service.execute(dto)
        //assert
        expect(result.IsSuccess).toBeTruthy()
    })
})