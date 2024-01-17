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

    const artistDetails = await ArtistObjectMother.createValidArtist(
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
    expect(result.IsSuccess).toBeTruthy();
    expect(result.StatusCode).toBe(200);
  });

  /*it('Error 404 cuando no se encuentra un album', async () => {
    // Arrange
    const user = await UserObjectMother.createNormalUser();
    const userRepositoryMock = UserRepositoryMock.create();
    userRepositoryMock.saveAggregate(user);

    const song1 = await SongObjectMother.createValidSong('Cancion1');
    const song2 = await SongObjectMother.createValidSong('Cancion2');
    const song3 = await SongObjectMother.createValidSong('Cancion3');
    const songs: Song[] = [song1, song2, song3];

    const albumDetails = AlbumObjectMother.createRandomAlbum(
      'AlbumRandom',
      songs,
    );

    const albumRepositoryMock = AlbumRepositoryMock.create();
    playlistRepositoryMock.PushPlaylist(PlaylistObjectMother.createRandomPlaylist());

    const songRepositoryMock = SongRepositoryMock.create();
    const artistRepositoryMock = ArtistRepositoryMock.create();

    const service = new GetPlaylistByIdService(
        playlistRepositoryMock,
        songRepositoryMock,
        artistRepositoryMock
    );

    const dto: GetPlaylistByIdEntryApplicationDto = {
        userId: user.Id.Id,
        playlistId: playlist.Id.Id,
    };

    // Act
    const result = await service.execute(dto);

    // Assert
    expect(result.IsSuccess).toBeFalsy();
    expect(result.StatusCode).toBe(404);
});*/

  it('Devuelve un error 404 si el album no existe', async () => {
    // Arrange
    const user = await UserObjectMother.createNormalUser();
    const userRepositoryMock = UserRepositoryMock.create();
    userRepositoryMock.saveAggregate(user);

    const albumRepositoryMock = AlbumRepositoryMock.create();
    const songRepositoryMock = SongRepositoryMock.create();
    const artistRepositoryMock = ArtistRepositoryMock.create();

    // No se guarda ningún álbum en el repositorio

    const dto: GetAlbumByIdEntryApplicationDto = {
      userId: user.Id.Id,
      albumId: 'albumNoExistente', // Id no existente
    };

    const service = new GetAlbumByIdService(
      albumRepositoryMock,
      artistRepositoryMock,
      songRepositoryMock,
    );

    // Act
    const result = await service.execute(dto);

    // Assert
    expect(result.IsSuccess).toBeFalsy(); // Esperamos que sea falso ya que debería ser un error
    expect(result.StatusCode).toBe(404); // Esperamos un código de estado 404
    // Puedes agregar más aserciones según sea necesario para tu lógica específica de error 404
  });
});
