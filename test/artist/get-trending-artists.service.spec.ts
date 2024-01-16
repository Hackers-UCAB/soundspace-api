import { UuidGenerator } from "src/common/infrastructure/uuid-generator";
import { ArtistObjectMother } from 'test/common/objects-mother/artist.object-mother';
import { ArtistRepositoryMock } from 'test/common/repository-mocks/artist.repository.mock';
import { GetTrendingArtistsService } from 'src/artist/application/services/get-trending-artists.application.service';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

// describe: describes the test suite. Expects a name for
// the suite and a method that will contain the tests.
describe('GetTrendingArtistsService', () => {
    let service: GetTrendingArtistsService;
    let artistRepository: ArtistRepositoryMock;

    beforeEach(() => {
        artistRepository = ArtistRepositoryMock.create();
        service = new GetTrendingArtistsService(artistRepository);
    });

    // it: describes an individual test. Expects a name 
    // for the test and a method that will contain the test, 
    // using the AAA pattern to structure the test.
    it('should return trending artists', async () => {
        // Arrange
        const trendingArtists = ArtistObjectMother.createValidArtistsArray(7, 'Artist',
            'Genre', 15, 3);
        trendingArtists.forEach(artist => artistRepository.saveMap(artist, true));
        const serviceEntry: ServiceEntry = { userId: new UuidGenerator().generate() };

        // Act
        const result = await service.execute(serviceEntry);

        // Assert
        expect(result.IsSuccess).toBeTruthy();
        expect(result.Data.artists.length).toBe(trendingArtists.length);
        expect(result.Data.artists).toEqual(trendingArtists);
    });

    it('should return a not found error because there are no trending artists', async () => {
        // Arrange
        const trendingArtists = ArtistObjectMother.createValidArtistsArray(5, 'Artist',
            'Genre', 10, 2);
        trendingArtists.forEach(artist => artistRepository.saveMap(artist));
        const serviceEntry: ServiceEntry = { userId: new UuidGenerator().generate() };

        // Act
        const result = await service.execute(serviceEntry);

        // Assert
        expect(result.IsSuccess).toBeFalsy();
        expect(result.statusCode).toBe(404);
        expect(result.error).toBeDefined();
    });
});