import { GetArtistByIdService } from 'src/artist/application/services/get-artist-by-id.application.service'
import { ArtistObjectMother } from 'test/common/objects-mother/artist.object-mother';
import { ArtistRepositoryMock } from 'test/common/repository-mocks/artist.repository.mock'
import { GetArtistByIdEntryApplicationDto } from 'src/artist/application/dto/entry/get-artist-by-id-entry.application.dto';
import { SongRepositoryMock } from 'test/common/repository-mocks/song.repository.mock';
import { AlbumRepositoryMock } from 'test/common/repository-mocks/album.repository.mock';
import { UuidGenerator } from 'src/common/infrastructure/uuid-generator';
import { SongObjectMother } from 'test/common/objects-mother/song.object-mother';
import { AlbumObjectMother } from 'test/common/objects-mother/album.object-mother';
import { Console } from 'console';

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
        const artist = await ArtistObjectMother.createValidArtistWithoutSongsAndAlbums(
            'Bon Jovi', 'Rock');
        artistRepository.save(artist);
        const song1 = await SongObjectMother.createValidSong('Livin on a prayer');
        const song2 = await SongObjectMother.createValidSong('You give love a bad name');
        const song3 = await SongObjectMother.createValidSong('Runaway');
        songRepository.save(song1);
        songRepository.save(song2);
        songRepository.save(song3);
        const album = await AlbumObjectMother.createRandomAlbum('Slippery when wet',
            [song1, song2, song3]);
        albumRepository.saveMap(album, artist.Id);
        artistRepository.patchArtist(artist.Id, [song1.Id, song2.Id, song3.Id], [album.Id])

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