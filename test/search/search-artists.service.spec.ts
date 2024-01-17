import { SearchArtistsApplicationService } from "src/artist/application/services/search-artists.application.service";
import { SearchItemsEntryApplicationDto } from "src/common/application/search/dto/entry/search.entry.dto";
import { ArtistObjectMother } from "test/common/objects-mother/artist.object-mother";
import { ArtistRepositoryMock } from "test/common/repository-mocks/artist.repository.mock";


describe('SearchArtistsService', () => {

    it('Pasa bien el servicio y devuelve una lista de artistas', async () => {
        const artistRepository = ArtistRepositoryMock.create();
        const artist1 =  ArtistObjectMother.createValidArtist('Natalia', 'Pop', 10, 2)
        artistRepository.save(artist1);
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'a' }
        const service = new SearchArtistsApplicationService(artistRepository);

        const result = await service.execute(dto);

        expect(result.IsSuccess).toBeTruthy();
    })

    it('Devuelve una lista vacia de artistas', async () => {
        const artistRepository = ArtistRepositoryMock.create();
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'a' }
        const service = new SearchArtistsApplicationService(artistRepository);

        const result = await service.execute(dto);

        expect(result.Data.data).toStrictEqual([]);
    })
})