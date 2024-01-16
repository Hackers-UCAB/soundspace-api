import { Artist } from "src/artist/domain/artist";
import { ArtistGenre } from "src/artist/domain/value-objects/artist-genre";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { ArtistName } from "src/artist/domain/value-objects/artist-name";
import { ArtistPhoto } from "src/artist/domain/value-objects/artist-photo";
import { ArtistSongs } from "src/artist/domain/value-objects/artist-songs";
import { UuidGenerator } from "src/common/infrastructure/uuid-generator";


export class AlbumObjectMother {
    static createRandomArtist(name: string) {
        const idGenerator = new UuidGenerator();
        const album = Artist.create(
            ArtistId.create(idGenerator.generate()),
            ArtistName.create(name),
            ArtistGenre.create('rock'),
            ArtistPhoto.create(''),
            )
        return album
    }    
}