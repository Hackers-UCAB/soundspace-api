import { UuidGenerator } from "src/common/infraestructure/uuid-generator";
import { Song } from "src/song/domain/song";
import { SongCover } from "src/song/domain/value-objects/song-cover";
import { SongDuration } from "src/song/domain/value-objects/song-duration";
import { SongGenres } from "src/song/domain/value-objects/song-genre";
import { SongId } from "src/song/domain/value-objects/song-id";
import { SongName } from "src/song/domain/value-objects/song-name";
import { SongPreviewUrl } from "src/song/domain/value-objects/song-preview-url";
import { SongUrl } from "src/song/domain/value-objects/song-url";



export class SongObjectMother {
    static async createValidSong(name: string) {
        const idGenerator = new UuidGenerator();
        const genre: string[] = ['Rock'];
        const song = Song.create(
            SongId.create(idGenerator.generate()),
            SongName.create(name),
            SongUrl.create('imagen.png'),
            SongCover.create('imagen.png'),
            SongGenres.create(genre),
            SongDuration.create(200),
            SongPreviewUrl.create('imagen.png')             
        )
        return song
    }
}