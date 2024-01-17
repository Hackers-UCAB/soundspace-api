import { ServiceEntry } from '../../src/common/application/services/dto/entry/service-entry.dto';
import { GetTopAlbumService } from 'src/album/application/services/get-top-album.application.service';
import { AlbumObjectMother } from 'test/common/objects-mother/album.object-mother';
import { UserObjectMother } from '../common/objects-mother/user.object-mother';
import { UserRepositoryMock } from '../common/repository-mocks/user.repository.mock';
import { AlbumRepositoryMock } from 'test/common/repository-mocks/album.repository.mock';
import { GetTopPlaylistService } from 'src/playlist/application/services/get-top-playlist.application.service';
import { Song } from 'src/song/domain/song';
import { SongObjectMother } from 'test/common/objects-mother/song.object-mother';
import { PlaylistRepositoryMock } from 'test/common/repository-mocks/playlist.repository.mock';

describe('Buscar albums trending', () => {
  it('retorna una lista de albums trending', async () => {
    //arrange
    const user = await UserObjectMother.createNormalUser();
    const userRepositoryMock = UserRepositoryMock.create();
    userRepositoryMock.saveAggregate(user);

    const song1 = await SongObjectMother.createValidSong('Cancion1');
    const song2 = await SongObjectMother.createValidSong('Cancion2');
    const song3 = await SongObjectMother.createValidSong('Cancion3');
    const songs: Song[] = [song1, song2, song3];

    const albumRepositoryMock = AlbumRepositoryMock.create();
    for (let i = 1; i <= 10; i++) {
      albumRepositoryMock.save(
        AlbumObjectMother.createRandomAlbum('AlbumRandom', songs),
      );
    }
    const service = new GetTopAlbumService(albumRepositoryMock);

    const dto: ServiceEntry = {
      userId: user.Id.Id,
    };

    //act
    const result = await service.execute(dto);

    //assert
    expect(result.IsSuccess).toBeTruthy();
    expect(result.StatusCode).toBe(200);
  });

  it('Error 404 ', async () => {
    // Arrange
    const user = await UserObjectMother.createNormalUser();
    const userRepositoryMock = UserRepositoryMock.create();
    userRepositoryMock.saveAggregate(user);
    const albumRepositoryMock = AlbumRepositoryMock.create(); // Utiliza un repositorio vac�o
    const service = new GetTopAlbumService(albumRepositoryMock);

    const dto: ServiceEntry = {
      userId: user.Id.Id,
    };

    // Act
    const result = await service.execute(dto);

    // Assert
    expect(result.IsSuccess).toBeFalsy();
    expect(result.StatusCode).toBe(404);
  });
});
