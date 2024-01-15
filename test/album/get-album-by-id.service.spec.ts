import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { GetAlbumByIdService } from 'src/album/application/services/get-album-by-id.application.service';
import { AlbumObjectMother } from 'test/common/objects-mother/album.object-mother';
import { LoggerMock } from 'test/common/others-mocks/logger.mock';
import { AuditingRepositoryMock } from 'test/common/repository-mocks/auditing.repository.mock';
import { AlbumRepositoryMock } from 'test/common/repository-mocks/album.repository.mock';
import { GetAlbumByIdEntryApplicationDto } from 'src/album/application/dto/entries/get-album-by-id-entry.application.dto';
import { ArtistRepositoryMock } from 'test/common/repository-mocks/artist.repository.mock';
import { SongRepositoryMock } from 'test/common/repository-mocks/song.repository.mock';

describe('Obtener un album por id', () => {
  it('Devuelve los detalles de un album si este existe', async () => {
    //arrange
    const albumRepositoryMock = new AlbumRepositoryMock();

    const albumDetails = AlbumObjectMother.createAlbumWithDetails(
      '5e97538a-77a6-43ae-92bc-70556b6cca99',
      'Happier Than Ever',
      'billieeilish_happierthanever.jpg',
      ['songId1', 'songId2'],
      300,
      'Música pop',
    );

    albumRepositoryMock.setAlbums([albumDetails]);

    const auditingRepositoryMock = new AuditingRepositoryMock();
    const loggerMock = new LoggerMock();
    const dto: GetAlbumByIdEntryApplicationDto = {
      userId: '1ade3d45-90c9-4bc7-a9e8-d13a67865784',
      albumId: '5e97538a-77a6-43ae-92bc-70556b6cca99',
    };

    const service = new LoggerApplicationServiceDecorator(
      new AuditingCommandServiceDecorator(
        new GetAlbumByIdService(
          albumRepositoryMock,
          new ArtistRepositoryMock(),
          new SongRepositoryMock(),
        ),
        auditingRepositoryMock,
        'GetAlbumByIdService',
        loggerMock,
      ),
      loggerMock,
      'GetAlbumByIdService',
    );

    //act
    const result = await service.execute(dto);

    //assert
    console.log('Result:', result);
    expect(result.IsSuccess).toBeTruthy();
  });
});
