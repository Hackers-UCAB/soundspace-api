import { UuidGenerator } from "src/common/infrastructure/uuid-generator";
import { Artist } from "src/artist/domain/artist";
import { ArtistAlbums } from "src/artist/domain/value-objects/artist-albums";
import { ArtistGenre } from "src/artist/domain/value-objects/artist-genre";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { ArtistName } from "src/artist/domain/value-objects/artist-name";
import { ArtistPhoto } from "src/artist/domain/value-objects/artist-photo";
import { ArtistSongs } from "src/artist/domain/value-objects/artist-songs";
import { SongId } from "src/song/domain/value-objects/song-id";
import { AlbumId } from "src/album/domain/value-objects/album-id";

export class ArtistObjectMother {

    // This method expects a valid artist name, genre, 
    // desired song count and desired album count.
    // (i.e. createValidArtist('Maroon 5', 'Pop rock', 10, 2)
    static createValidArtist(name: string, genre: string, songCount: number,
        albumCount: number) {

        const idGenerator = new UuidGenerator();
        const songIds = Array.from({ length: songCount },
            () => SongId.create(idGenerator.generate()));
        const albumIds = Array.from({ length: albumCount },
            () => AlbumId.create(idGenerator.generate()));
        const artist = Artist.create(
            ArtistId.create(idGenerator.generate()),
            ArtistName.create(name),
            ArtistGenre.create(genre),
            ArtistPhoto.create('photo.png'),
            ArtistSongs.create(songIds),
            ArtistAlbums.create(albumIds)
        )

        return artist;

    }
}
