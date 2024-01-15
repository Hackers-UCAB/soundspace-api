import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { GetUserInfoApplicationService } from "src/user/application/services/get-user-info.application.service";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";

describe('GetUserInfoService', () => {

    it('Se obtiene correctamente', async () => {
        const userRepositoryMock = UserRepositoryMock.create();
        const user = await UserObjectMother.createNormalUser();
        userRepositoryMock.saveAggregate(user);
        const service = new GetUserInfoApplicationService(userRepositoryMock);
        const dto: ServiceEntry = { userId: user.Id.Id }

        const result = await service.execute(dto);

        expect(result.IsSuccess).toBeTruthy();
    })

    it('Hay un bad request porque el usuario no existe', async () => {
        const userRepositoryMock = UserRepositoryMock.create();
        const user = await UserObjectMother.createNormalUser();
        const service = new GetUserInfoApplicationService(userRepositoryMock);
        const dto: ServiceEntry = { userId: user.Id.Id }

        const result = await service.execute(dto);

        expect(result.IsSuccess).toBeFalsy();
    })
})