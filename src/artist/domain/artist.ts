import { AggregateRoot } from 'src/common/domain/aggregate-root';
import { InvalidArtistException } from "./exceptions/invalid-artist.exception";
import { DomainEvent } from 'src/common/domain/domain-event';
import { ArtistAlbums } from "./value-objects/artist-albums";
import { ArtistGenre } from "./value-objects/artist-genre";
import { ArtistName } from "./value-objects/artist-name";
import { ArtistSongs } from "./value-objects/artist-songs";
import { ArtistPhoto } from "./value-objects/artist-photo";
import { ArtistId } from "./value-objects/artist-id";
import { ArtistCreated } from "./events/artist-created.event";
//TODO: Cambiar implementacion
export class Artist extends AggregateRoot<ArtistId> {

    private name: ArtistName;
    private genre: ArtistGenre;
    private photo: ArtistPhoto;
    private songs: ArtistSongs;
    private albums: ArtistAlbums;

    get Name(): ArtistName {
        return this.name;
    }

    get Genre(): ArtistGenre {
        return this.genre;
    }

    get Photo(): ArtistPhoto {
        return this.photo;
    }

    get Albums(): ArtistAlbums {
        return this.albums;
    }

    get Songs(): ArtistSongs {
        return this.songs;
    }

    protected constructor(
        id: ArtistId,
        name: ArtistName,
        genre: ArtistGenre,
        photo: ArtistPhoto,
        songs: ArtistSongs,
        albums?: ArtistAlbums,
    ) {
        const artistCreated = ArtistCreated.create(
            id,
            name,
            genre,
            photo,
            albums,
            songs
        )
        super(id, artistCreated);
    }

    protected when(event: DomainEvent): void {
        if (event instanceof ArtistCreated) {
            this.name = event.name;
            this.genre = event.genre;
            this.photo = event.photo;
            this.albums = event.albums;
            this.songs = event.songs;
        }
    }

    protected ensureValidaState(): void {
        if (
            !this.name ||
            !this.genre ||
            !this.photo ||
            !this.songs
        ) {
            throw new InvalidArtistException("Artist not valid");
        }
    }

    static create(
        id: ArtistId,
        name: ArtistName,
        genre: ArtistGenre,
        photo: ArtistPhoto,
        songs: ArtistSongs,
        albums?: ArtistAlbums,
    ): Artist {
        return new Artist(
            id,
            name,
            genre,
            photo,
            songs,
            albums,
        )
    }

}
