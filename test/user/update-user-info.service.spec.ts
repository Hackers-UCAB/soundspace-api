import { UpdateUserInfoApplicationService } from "src/user/application/services/update-user-info.application.service";
import { UserObjectMother } from "test/common/objects-mother/user.object-mother";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";


describe('UpdateUserInfoService', () => {

    it('Se actualiza correctamente', async () => {
        const userRepositoryMock = UserRepositoryMock.create();
        const user = await UserObjectMother.createNormalUser();
        userRepositoryMock.saveAggregate(user);
        const updateEntry = UserObjectMother.validPatchEntry(user.Id);
        const service = new UpdateUserInfoApplicationService(userRepositoryMock);

        const result = await service.execute(updateEntry);
        
        expect(result.IsSuccess).toBeTruthy();
    })

    it('El usuario no existe en la base de datos', async () => {
        const userRepositoryMock = UserRepositoryMock.create();
        const user = await UserObjectMother.createNormalUser();
        const updateEntry = UserObjectMother.validPatchEntry(user.Id);
        const service = new UpdateUserInfoApplicationService(userRepositoryMock);
        
        const result = await service.execute(updateEntry);

        expect(result.IsSuccess).toBeFalsy();
    })
})