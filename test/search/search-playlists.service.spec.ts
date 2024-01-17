import { SearchItemsEntryApplicationDto } from "src/common/application/search/dto/entry/search.entry.dto";
import { SearchPlaylistsApplicationService } from "src/playlist/application/services/search-playlists.application.service";
import { PlaylistObjectMother } from "test/common/objects-mother/playlist.object-mother";
import { PlaylistRepositoryMock } from "test/common/repository-mocks/playlist.repository.mock";
import { Result } from '../../src/common/domain/result-handler/result';


describe('SearchPlaylistsService', () => {

    it('Pasa bien el servicio y devuelve una lista de playlists', async () => {
        const playlistRepository = PlaylistRepositoryMock.create();
        const playlist1 = await PlaylistObjectMother.createRandomPlaylist()
        playlistRepository.PushPlaylist(playlist1);
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'a' }
        const service = new SearchPlaylistsApplicationService(playlistRepository);

        const result = await service.execute(dto);

        expect(result.IsSuccess).toBeTruthy();
    })

    it('Devuelve una lista vacia de playlists', async () => {
        const playlistRepository = PlaylistRepositoryMock.create();
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'a' }
        const service = new SearchPlaylistsApplicationService(playlistRepository);

        const result = await service.execute(dto);

        expect(result.Data).toBeNull();
    })
})