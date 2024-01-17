import { UuidGenerator } from "src/common/infrastructure/uuid-generator";
import { ArtistAlbums } from "src/artist/domain/value-objects/artist-albums";
import { ArtistGenre } from "src/artist/domain/value-objects/artist-genre";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { ArtistName } from "src/artist/domain/value-objects/artist-name";
import { ArtistPhoto } from "src/artist/domain/value-objects/artist-photo";
import { ArtistSongs } from "src/artist/domain/value-objects/artist-songs";
import { SongId } from "src/song/domain/value-objects/song-id";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { Artist } from "src/artist/domain/artist";

export class ArtistObjectMother {

    // This method expects a valid artist name, genre, 
    // desired song count and desired album count.
    // (i.e. createValidArtist('Maroon 5', 'Pop rock', 10, 2)
    static async createValidArtist(name: string, genre: string, songCount: number,
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

    // In this method, a for loop is used to create a specified number of artists.
    // The name of each artist is the provided namePrefix followed by the current 
    // iteration number, and the genre of each artist is the provided genrePrefix 
    // followed by the current iteration number. All artists have the same number 
    // of songs and albums. The created artists are then pushed into the artists 
    // array, which is returned by the method.
    static async createValidArtistsArray(count: number, namePrefix: string,
        genrePrefix: string, songCount: number, albumCount: number) {

        const artists = [];
        for (let i = 0; i < count; i++) {
            const artist = this.createValidArtist(`${namePrefix} ${i}`,
                `${genrePrefix} ${i}`, songCount, albumCount);
            artists.push(artist);
        }

        return artists;

    }

    static async createValidArtistWithoutSongsAndAlbums(name: string, genre: string) {
            
            const idGenerator = new UuidGenerator();
            const artist = Artist.create(
                ArtistId.create(idGenerator.generate()),
                ArtistName.create(name),
                ArtistGenre.create(genre),
                ArtistPhoto.create('photo.png'),
                ArtistSongs.create([]),
                ArtistAlbums.create([])
            )
    
            return artist;

    }

}
