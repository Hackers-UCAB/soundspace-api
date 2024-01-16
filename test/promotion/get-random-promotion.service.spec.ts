import exp from "constants";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { GetRandomPromotionApplicationService } from "src/promotions/application/services/get-random-promotion.application.service";
import { PromotionObjectMother } from "test/common/objects-mother/promotion.object-mother";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { PromotionRepositoryMock } from "test/common/repository-mocks/promotion.repository.mock";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";

describe('Buscar una promocion aleatoria', () => {
    it('Devuelve una promocion', async () => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        const promotionRepositoryMock = PromotionRepositoryMock.create();
        const promotion = await PromotionObjectMother.createRandomPromotion();
        promotionRepositoryMock.saveAggregate(promotion);

        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        const service = new GetRandomPromotionApplicationService(promotionRepositoryMock);
        //act

        const result = await service.execute(dto);
        //assert
        expect(result.IsSuccess).toBeTruthy();

    })

    it('No existe ninguna promocion', async() => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        const promotionRepositoryMock = PromotionRepositoryMock.create();

        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        const service = new GetRandomPromotionApplicationService(promotionRepositoryMock)
        
        //act
        const result = await service.execute(dto);

        //assert

        expect(result.IsSuccess).toBeFalsy();
    })


})