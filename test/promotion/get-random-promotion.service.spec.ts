import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { GetRandomPromotionApplicationService } from "src/promotions/application/services/get-random-promotion.application.service";
import { PromotionObjectMother } from "test/common/objects-mother/promotion.object-mother";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { LoggerMock } from "test/common/others-mocks/logger.mock";
import { AuditingRepositoryMock } from "test/common/repository-mocks/auditing.repository.mock";
import { PromotionRepositoryMock } from "test/common/repository-mocks/promotion.repository.mock";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";

describe('Buscar una promocion aleatoria', () => {
    it('Devuelve una promocion', async () => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserRepositoryMock();
        userRepositoryMock.saveAggregate(user);
        const promotionRepositoryMock = new PromotionRepositoryMock();
        const promotion = await PromotionObjectMother.createRandomPromotion();
        promotionRepositoryMock.saveAggregate(promotion);
        const auditingRepositoryMock = new AuditingRepositoryMock()
        const loggerMock = new LoggerMock()

        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        const service = new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetRandomPromotionApplicationService(
                promotionRepositoryMock
              ),
              auditingRepositoryMock,
              'Get Random Promotion',
              loggerMock,
            ),
            loggerMock,
            'Get Random Promotion',
          );
        //act

        const result = await service.execute(dto);
        //assert
        expect(result.IsSuccess).toBeTruthy();

    })

    it('No existe ninguna promocion', async() => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserRepositoryMock();
        userRepositoryMock.saveAggregate(user);
        const promotionRepositoryMock = new PromotionRepositoryMock();
        const auditingRepositoryMock = new AuditingRepositoryMock()
        const loggerMock = new LoggerMock()

        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        
    })


})