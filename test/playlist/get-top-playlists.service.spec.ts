import { ServiceEntry } from "../../src/common/application/services/dto/entry/service-entry.dto";
import { GetTopPlaylistService } from "../../src/playlist/application/services/get-top-playlist.application.service";
import { PlaylistObjectMother } from "../common/objects-mother/playlist.object-mother";
import { UserObjectMother } from "../common/objects-mother/user.object-mother";
import { PlaylistRepositoryMock } from "../common/repository-mocks/playlist.repository.mock";
import { UserRepositoryMock } from "../common/repository-mocks/user.repository.mock";

describe('Buscar playlists con trending = true', () => {
    it('retorna una lista de playlist con trending = true', async () => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        const playlistRepositoryMock = PlaylistRepositoryMock.create();
        for (let i = 1; i <= 10; i++) {
            playlistRepositoryMock.PushPlaylist(PlaylistObjectMother.createRandomPlaylist())
        }       
        const service = new GetTopPlaylistService(playlistRepositoryMock);

        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        //act
        const result = await service.execute(dto);

        //assert
        expect(result.IsSuccess).toBeTruthy();
        expect(result.StatusCode).toBe(200);

    })

    it('retorna un un result error con codigo 404', async () => {
        // Arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        const emptyPlaylistRepositoryMock = PlaylistRepositoryMock.create(); // Utiliza un repositorio vacío
        const service = new GetTopPlaylistService(emptyPlaylistRepositoryMock);

        const dto: ServiceEntry = {
            userId: user.Id.Id
        };

        // Act
        const result = await service.execute(dto);

        // Assert
        expect(result.IsSuccess).toBeFalsy();
        expect(result.StatusCode).toBe(404);
    })

})
