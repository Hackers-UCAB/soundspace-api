import { ServiceEntry } from "../../src/common/application/services/dto/entry/service-entry.dto";
import { GetTopSongsService } from "../../src/song/application/services/get-top-songs.application.service";
import { SongObjectMother } from "../common/objects-mother/Song.object-mother";
import { UserObjectMother } from "../common/objects-mother/user.object-mother";
import { ArtistRepositoryMock } from "../common/repository-mocks/artist.repository.mock";
import { SongRepositoryMock } from "../common/repository-mocks/song.repository.mock";
import { UserRepositoryMock } from "../common/repository-mocks/user.repository.mock";

describe('Buscar songs con trending = true', () => {
    it('retorna una lista de Song con trending = true', async () => {
        //arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        const songRepositoryMock = SongRepositoryMock.create();
        const artisRepositoryMock = ArtistRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        for (let i = 1; i <= 10; i++) {
            songRepositoryMock.save(await SongObjectMother.createValidSong("cancion"))
        }
        const service = new GetTopSongsService(songRepositoryMock, artisRepositoryMock);
        const dto: ServiceEntry = {
            userId: user.Id.Id
        }

        //act
        const result = await service.execute(dto);

        //assert
        expect(result.IsSuccess).toBeTruthy();

    })

    it('retorna un un result error con codigo 404', async () => {
        // Arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        const songRepositoryMock = SongRepositoryMock.create();
        const artisRepositoryMock = ArtistRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);
        const service = new GetTopSongsService(songRepositoryMock, artisRepositoryMock);

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
