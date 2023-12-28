import { DomainEvent } from "src/common/domain/domain-event";
import { ArtistAlbums } from "../value-objects/artist-albums";
import { ArtistGenre } from "../value-objects/artist-genre";
import { ArtistName } from "../value-objects/artist-name";
import { ArtistSongs } from "../value-objects/artist-songs";
import { ArtistPhoto } from "../value-objects/artist-photo";
import { ArtistId } from "../value-objects/artist-id";

export class ArtistCreated extends DomainEvent {

    protected constructor(
        public id: ArtistId,
        public name: ArtistName,
        public genre: ArtistGenre,
        public photo: ArtistPhoto,
        public albums: ArtistAlbums,
        public songs: ArtistSongs
    ){
        super()
    }

    static create(
        id: ArtistId,
        name: ArtistName,
        genre: ArtistGenre,
        photo: ArtistPhoto,
        albums: ArtistAlbums,
        songs: ArtistSongs
    ): ArtistCreated{
        return new ArtistCreated(
            id,
            name,
            genre,
            photo,
            albums,
            songs
        )
    }
    
}