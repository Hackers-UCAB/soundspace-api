import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { Album } from 'src/album/domain/album';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { AlbumName } from 'src/album/domain/value-objects/album-name';
import { AlbumCover } from 'src/album/domain/value-objects/album-cover';
import { AlbumSongs } from 'src/album/domain/value-objects/album-songs';
import { AlbumDuration } from 'src/album/domain/value-objects/album-duration';
import { AlbumGenre } from 'src/album/domain/value-objects/album-genre';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class AlbumObjectMother {
  static createAlbumWithDetails(
    id: string,
    name: string,
    coverUrl: string,
    songs: string[],
    durationInSeconds: number,
    genre: string,
  ): Album {
    const idGenerator = new UuidGenerator();

    const albumId = AlbumId.create(id || idGenerator.generate());
    const albumName = AlbumName.create(name || 'AlbumName');
    const albumCover = AlbumCover.create(
      coverUrl || 'https://example.com/cover.jpg',
    );

    // Convertir las cadenas de canciones a objetos SongId
    const songIds: SongId[] = songs.map((song) => SongId.create(song));

    const albumSongs = AlbumSongs.create(songIds || []);
    const albumDuration = AlbumDuration.create(durationInSeconds || 300);
    const albumGenre = AlbumGenre.create(genre || 'Rock');

    return Album.create(albumId, albumName, albumCover, albumSongs, albumGenre);
  }
}
