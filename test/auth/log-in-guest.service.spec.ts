import { LoginGuestApplicationService } from "src/auth/application/services/log-in-guest-service.application.service";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";
import { JwtGeneratorMock } from "test/common/others-mocks/jwt-generator.mock";
import { UuidGeneratorMock } from "test/common/others-mocks/uuid-generator.mock";
import { UserRepositoryMock } from "test/common/repository-mocks/user.repository.mock";


describe('LogInGuestService', () => {

    it('Se logea correctamente', async () => {
      const userRepository = UserRepositoryMock.create();
      const uuidGenerator = UuidGeneratorMock.create();
      const jwtGenerator = JwtGeneratorMock.create();
      const dto: ServiceEntry = { userId: 'Unknown' };
      const service = new LoginGuestApplicationService(userRepository, jwtGenerator, uuidGenerator);

      const result = await service.execute(dto)

      expect(result.IsSuccess).toBeTruthy()
    })
})