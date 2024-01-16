import { GetPlaylistByIdEntryApplicationDto } from "../../src/playlist/application/dto/entry/get-playlist-by-id-entry.application.dto";
import { GetPlaylistByIdService } from "../../src/playlist/application/services/get-playlist-by-id.application.service";
import { PlaylistObjectMother } from "../common/objects-mother/playlist.object-mother";
import { SongObjectMother } from "../common/objects-mother/song.object-mother";
import { UserObjectMother } from "../common/objects-mother/user.object-mother";
import { ArtistRepositoryMock } from "../common/repository-mocks/artist.repository.mock";
import { PlaylistRepositoryMock } from "../common/repository-mocks/playlist.repository.mock";
import { SongRepositoryMock } from "../common/repository-mocks/song.repository.mock";
import { UserRepositoryMock } from "../common/repository-mocks/user.repository.mock";

describe('Buscar playlist mediante su ID', () => {
    it('retorna una playlist existente buscada por su ID', async () => {
        // Arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);

        const playlist = PlaylistObjectMother.createRandomPlaylist();
        const playlistRepositoryMock = PlaylistRepositoryMock.create();
        playlistRepositoryMock.PushPlaylist(playlist);

        const songRepositoryMock = SongRepositoryMock.create();
        const artistRepositoryMock = ArtistRepositoryMock.create();

        const service = new GetPlaylistByIdService(
            playlistRepositoryMock,
            songRepositoryMock,
            artistRepositoryMock
        );

        const dto: GetPlaylistByIdEntryApplicationDto = {
            userId: user.Id.Id,
            playlistId: playlist.Id.Id,
        };

        // Act
        const result = await service.execute(dto);

        // Assert
        expect(result.IsSuccess).toBeTruthy();
        expect(result.StatusCode).toBe(200);
    });
    
    it('retorna un resultado de error con código 404 para una playlist inexistente', async () => {
        // Arrange
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = UserRepositoryMock.create();
        userRepositoryMock.saveAggregate(user);

        const playlist = PlaylistObjectMother.createRandomPlaylist();
        const playlistRepositoryMock = PlaylistRepositoryMock.create();
        playlistRepositoryMock.PushPlaylist(PlaylistObjectMother.createRandomPlaylist());

        const songRepositoryMock = SongRepositoryMock.create();
        const artistRepositoryMock = ArtistRepositoryMock.create();

        const service = new GetPlaylistByIdService(
            playlistRepositoryMock,
            songRepositoryMock,
            artistRepositoryMock
        );

        const dto: GetPlaylistByIdEntryApplicationDto = {
            userId: user.Id.Id,
            playlistId: playlist.Id.Id,
        };

        // Act
        const result = await service.execute(dto);

        // Assert
        expect(result.IsSuccess).toBeFalsy();
        expect(result.StatusCode).toBe(404);
    });
})
