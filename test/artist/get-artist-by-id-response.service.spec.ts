import { GetArtistByIdService } from 'src/artist/application/services/get-artist-by-id.application.service'
import { ArtistObjectMother } from 'test/common/objects-mother/artist.object-mother';
import { ArtistRepositoryMock } from 'test/common/repository-mocks/artist.repository.mock'
import { GetArtistByIdEntryApplicationDto } from 'src/artist/application/dto/entry/get-artist-by-id-entry.application.dto';
import { SongRepositoryMock } from 'test/common/repository-mocks/song.repository.mock';
import { AlbumRepositoryMock } from 'test/common/repository-mocks/album.repository.mock';
import { UuidGenerator } from 'src/common/infrastructure/uuid-generator';

// FALTA POR IMPLEMENTAR:
// ~ findSongById() en SongRepositoryMock
// ~ findAlbumByArtist() en AlbumRepositoryMock

describe('GetArtistByIdService', () => {
    let service: GetArtistByIdService;
    let artistRepository: ArtistRepositoryMock;
    let songRepository: SongRepositoryMock;
    let albumRepository: AlbumRepositoryMock;

    beforeEach(() => {
        artistRepository = ArtistRepositoryMock.create();
        songRepository = SongRepositoryMock.create();
        albumRepository = AlbumRepositoryMock.create();
        service = new GetArtistByIdService(artistRepository, songRepository, albumRepository);
    });

    it('should return the artist if it exists', async () => {
        // Arrange
        const artist = ArtistObjectMother.createValidArtist('Bon Jovi', 'Rock', 20, 4);
        artistRepository.save(artist);

        const dto: GetArtistByIdEntryApplicationDto = {
            artistId: artist.Id.Id,
            userId: new UuidGenerator().generate(),
        };

        // Act
        const result = await service.execute(dto);

        // Assert
        expect(result.IsSuccess).toBeTruthy();
        expect(result.Data.artist.Id.Id).toBe(artist.Id.Id);
    });

    it('should return a fail result if the artist does not exist', async () => {
        // Arrange
        const dto: GetArtistByIdEntryApplicationDto = {
            artistId: new UuidGenerator().generate(),
            userId: new UuidGenerator().generate(),
        };

        // Act
        const result = await service.execute(dto);

        // Assert
        expect(result.IsSuccess).toBeFalsy();
        expect(result.statusCode).toBe(404);
    });
});