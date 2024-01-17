import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { GetAlbumByIdService } from 'src/album/application/services/get-album-by-id.application.service';
import { AlbumObjectMother } from 'test/common/objects-mother/album.object-mother';
import { AlbumRepositoryMock } from 'test/common/repository-mocks/album.repository.mock';
import { UserObjectMother } from '../common/objects-mother/user.object-mother';
import { UserRepositoryMock } from '../common/repository-mocks/user.repository.mock';
import { GetAlbumByIdEntryApplicationDto } from 'src/album/application/dto/entry/get-album-by-id-entry.application.dto';
import { ArtistRepositoryMock } from 'test/common/repository-mocks/artist.repository.mock';
import { SongRepositoryMock } from 'test/common/repository-mocks/song.repository.mock';
import { Song } from 'src/song/domain/song';
import { SongObjectMother } from 'test/common/objects-mother/song.object-mother';
import { ArtistObjectMother } from 'test/common/objects-mother/artist.object-mother';

describe('Obtener un album por id', () => {
  it('Devuelve los detalles de un album si este existe', async () => {
    //Arrange

    const user = await UserObjectMother.createNormalUser();
    const userRepositoryMock = UserRepositoryMock.create();
    userRepositoryMock.saveAggregate(user);

    const albumRepositoryMock = AlbumRepositoryMock.create();
    const songRepositoryMock = SongRepositoryMock.create();
    const artistRepositoryMock = ArtistRepositoryMock.create();
    const song1 = await SongObjectMother.createValidSong('Cancion1');
    const song2 = await SongObjectMother.createValidSong('Cancion2');
    const song3 = await SongObjectMother.createValidSong('Cancion3');
    const songs: Song[] = [song1, song2, song3];

    const albumDetails = AlbumObjectMother.createRandomAlbum(
      'AlbumRandom',
      songs,
    );

    albumRepositoryMock.save(albumDetails);

    const artistDetails = ArtistObjectMother.createValidArtist(
      'Juan',
      'rock',
      1,
      1,
    );
    artistRepositoryMock.save(artistDetails);

    songRepositoryMock.save(song1);
    songRepositoryMock.save(song2);
    songRepositoryMock.save(song3);

    const dto: GetAlbumByIdEntryApplicationDto = {
      userId: user.Id.Id,
      albumId: albumDetails.Id.Id,
    };

    const service = new GetAlbumByIdService(
      albumRepositoryMock,
      artistRepositoryMock,
      songRepositoryMock,
    );

    // Act
    const result = await service.execute(dto);

    // Assert
    console.log('Result:', result);
    expect(result.IsSuccess).toBeTruthy();
    expect(result.StatusCode).toBe(200);

    //act
    //const result = await service.execute(dto);

    //assert
    //console.log('Result:', result);
    //expect(result.IsSuccess).toBeTruthy();
  });
});
