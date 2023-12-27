import { DomainEvent } from "src/common/domain/domain-event";
import { PlaylistCover } from "../value-objects/playlist-cover";
import { PlaylistId } from "../value-objects/playlist-id";
import { PlaylistName } from "../value-objects/playlist-name";
import { PlaylistSong } from "../value-objects/playlist-songs";


export class PlaylistCreated extends DomainEvent {

    protected constructor(
        public id: PlaylistId,
        public name: PlaylistName,
        public cover: PlaylistCover,
        public playlistSongs: PlaylistSong
    ) {
        super()
    }

    static create(
        id: PlaylistId,
        name: PlaylistName,
        cover: PlaylistCover,
        playlistSongs: PlaylistSong

    ): PlaylistCreated {
        return new PlaylistCreated(id, name, cover, playlistSongs);
    }
}
