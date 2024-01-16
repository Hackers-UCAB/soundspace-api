import { SearchAlbumsApplicationService } from "src/album/application/services/search-albums.application.service";
import { SearchItemsEntryApplicationDto } from "src/common/application/search/dto/entry/search.entry.dto";
import { Song } from "src/song/domain/song";
import { AlbumObjectMother } from "test/common/objects-mother/album.object-mother";
import { SongObjectMother } from "test/common/objects-mother/song.object-mother";
import { AlbumRepositoryMock } from "test/common/repository-mocks/album.repository.mock";

describe('SearchAlbumsService', () => {
    it('Pasa bien el servicio y devuelve una lista de albums', async () => {
        const albumRepository = AlbumRepositoryMock.create();
        const song1 = await SongObjectMother.createValidSong('Cancion1');
        const song2 = await SongObjectMother.createValidSong('Cancion2');
        const song3 = await SongObjectMother.createValidSong('Cancion3');
        const songs: Song[] = [song1, song2, song3];
        const album = AlbumObjectMother.createRandomAlbum('Album1', songs);
        albumRepository.save(album);
        const dto: SearchItemsEntryApplicationDto = { userId: 'Unknown', name: 'u' }
        const service = new SearchAlbumsApplicationService(albumRepository);

        const result = await service.execute(dto);

        expect(result.IsSuccess).toBeTruthy();
    })

    it('No encuentra ningun album', async () => {
        const albumRepository = AlbumRepositoryMock.create();
        const song1 = await SongObjectMother.createValidSong('Cancion1');
        const song2 = await SongObjectMother.createValidSong('Cancion2');
        const song3 = await SongObjectMother.createValidSong('Cancion3');
        const songs: Song[] = [song1, song2, song3];
        const album = AlbumObjectMother.createRandomAlbum('Album1', songs);
        albumRepository.save(album);
        const dto: SearchItemsEntryApplicationDto = { userId: 'Unknown', name: 'z' }
        const service = new SearchAlbumsApplicationService(albumRepository);

        const result = await service.execute(dto);

        expect (result.Data).toBeNull();
    })
})