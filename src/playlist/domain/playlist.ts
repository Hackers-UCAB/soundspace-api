import { AggregateRoot } from "src/common/domain/aggregate-root";
import { DomainEvent } from "src/common/domain/domain-event";
import { PlaylistCover } from "./value-objects/playlist-cover";
import { PlaylistId } from "./value-objects/playlist-id";
import { PlaylistName } from "./value-objects/playlist-name";
import { PlaylistSong } from "./value-objects/playlist-songs";
import { PlaylistCreated } from "./events/playlist-created.event";
import { InvalidPlaylistException } from "./exceptions/invalid-playlist.exception";
export class Playlist extends AggregateRoot<PlaylistId>{

    private name: PlaylistName;
    private cover: PlaylistCover;
    private playlistSongs: PlaylistSong;

    get Name(): PlaylistName {
        return this.name;
    }

    get Cover(): PlaylistCover {
        return this.cover;
    }

    get PlaylistSongs(): PlaylistSong {
        return this.playlistSongs;
    }

    protected constructor(
        id: PlaylistId,
        name: PlaylistName,
        cover: PlaylistCover,
        playlistSongs: PlaylistSong,
    ) {
        const playlistCreated = PlaylistCreated.create(
            id,
            name,
            cover,
            playlistSongs,
        )
        super(id, playlistCreated);
        //Aqui deberia usar la funcion de pull ya que no deberia tener eventos de dominio, ya que solo es de consulta
    }

    protected when(event: DomainEvent): void {
        if (event instanceof PlaylistCreated) {
            this.name = event.name;
            this.cover = event.cover;
            this.playlistSongs = event.playlistSongs;
        }
    }

    protected ensureValidaState(): void {
        if (
            !this.name ||
            !this.cover ||
            !this.playlistSongs 
        ) {
            throw new InvalidPlaylistException("Playlist not valid");
        }
    }

    static create(
        id: PlaylistId,
        name: PlaylistName,
        cover: PlaylistCover,
        playlistSongs: PlaylistSong,
    ): Playlist {
        const playlist = new Playlist(
            id,
            name,
            cover,
            playlistSongs,
        );
        return playlist;
    }
}
