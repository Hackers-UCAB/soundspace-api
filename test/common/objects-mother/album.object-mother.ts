import { Album } from "src/album/domain/album";
import { AlbumCover } from "src/album/domain/value-objects/album-cover";
import { AlbumGenre } from "src/album/domain/value-objects/album-genre";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { AlbumName } from "src/album/domain/value-objects/album-name";
import { AlbumSongs } from "src/album/domain/value-objects/album-songs";
import { UuidGenerator } from "src/common/infrastructure/uuid-generator";
import { Song } from "src/song/domain/song";
import { SongId } from "src/song/domain/value-objects/song-id";

export class AlbumObjectMother {
    static createRandomAlbum(name: string, songs: Song[]) {
        const idGenerator = new UuidGenerator();
        let ids: SongId[] = [];
        songs.forEach(song => {
            ids.push(song.Id)
        });
        const album = Album.create(
            AlbumId.create(idGenerator.generate()),
            AlbumName.create(name),
            AlbumCover.create('https://albumcover.com'),
            AlbumSongs.create(ids),
            AlbumGenre.create('rock')
        )
        return album
    }    
}