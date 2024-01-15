import { SearchItemsEntryApplicationDto } from "src/common/application/search/dto/entry/search.entry.dto";
import { SearchSongsApplicationService } from "src/song/application/services/search-songs.application.service";
import { SongObjectMother } from "test/common/objects-mother/song.object-mother";
import { SongRepositoryMock } from "test/common/repository-mocks/song.repository.mock";


describe('SearchSongService', () => {
    it('Pasa bien el servicio y devuelve una lista de canciones', async () => {
        const songRepository = SongRepositoryMock.create();
        const song1 = await SongObjectMother.createValidSong('Natalia')
        const song2 = await SongObjectMother.createValidSong('Cristian')
        const song3 = await SongObjectMother.createValidSong('Samira')
        songRepository.save(song1);
        songRepository.save(song2);
        songRepository.save(song3);
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'a' }
        const searchSongService = new SearchSongsApplicationService(songRepository);

        const result = await searchSongService.execute(dto);

        expect(result.IsSuccess).toBeTruthy();
    });

    it('No encuentra ninguna cancion con el nombre', async () => {
        const songRepository = SongRepositoryMock.create();
        const song1 = await SongObjectMother.createValidSong('Natalia')
        const song2 = await SongObjectMother.createValidSong('Cristian')
        const song3 = await SongObjectMother.createValidSong('Samira')
        songRepository.save(song1);
        songRepository.save(song2);
        songRepository.save(song3);
        const dto: SearchItemsEntryApplicationDto = { userId: 'XD', name: 'z' }
        const searchSongService = new SearchSongsApplicationService(songRepository);

        const result = await searchSongService.execute(dto);

        expect (result.Data).toBeNull();
    })
})