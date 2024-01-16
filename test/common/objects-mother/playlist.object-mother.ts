import { UuidGenerator } from "../../../src/common/infrastructure/uuid-generator";
import { Playlist } from "../../../src/playlist/domain/playlist";
import { PlaylistCover } from "../../../src/playlist/domain/value-objects/playlist-cover";
import { PlaylistId } from "../../../src/playlist/domain/value-objects/playlist-id";
import { PlaylistName } from "../../../src/playlist/domain/value-objects/playlist-name";
import { PlaylistSong } from "../../../src/playlist/domain/value-objects/playlist-songs";
import { SongId } from "../../../src/song/domain/value-objects/song-id";

export class PlaylistObjectMother {

    static createRandomPlaylist() {
        const idGenerator = new UuidGenerator()

        const randomPlaylist = Playlist.create(
            PlaylistId.create(idGenerator.generate()),
            PlaylistName.create("nombre de la playlist"),
            PlaylistCover.create("url_de_la_imagen_de_la_playlist.com"),
            PlaylistSong.create([
                SongId.create(idGenerator.generate()),
                SongId.create(idGenerator.generate()),
                ]
            ),
        )
        return randomPlaylist;
    }

    static createPlaylistByName(name: string) {
        const idGenerator = new UuidGenerator()

        const randomPlaylist = Playlist.create(
            PlaylistId.create(idGenerator.generate()),
            PlaylistName.create(name),
            PlaylistCover.create("url_de_la_imagen_de_la_playlist.com"),
            PlaylistSong.create([
                SongId.create(idGenerator.generate()),
                SongId.create(idGenerator.generate()),
            ]
            ),
        )
        return randomPlaylist;
    }
}