import { Result } from "src/common/domain/result-handler/result";
import { Playlist } from "../../../src/playlist/domain/playlist";
import { IPlaylistRepository } from "../../../src/playlist/domain/repositories/playlist.repository.interface";
import { PlaylistId } from "../../../src/playlist/domain/value-objects/playlist-id";

export class PlaylistRepositoryMock implements IPlaylistRepository {
    private readonly playlists: Playlist[] = [];

    async findPlaylistById(id: PlaylistId): Promise<Result<Playlist>> {
        let response: Playlist | undefined;
        let error: Error | undefined;
        try {

            const response = this.playlists.find((playlist) => playlist.Name.Name === id.Id);

        } catch (e) {
            error = e;
        } finally {
            if (error) {
                return Result.fail(
                    null,
                    500,
                    error.message || 'Error simulado obteniendo la playlist',
                    error,
                );
            }

            if (!response) {
                return Result.fail(
                    null,
                    404,
                    'No existe la playlist solicitada',
                    new Error('No existe la playlist solicitada'),
                );
            }

            return Result.success<Playlist>(response, 200);
        }
    }

    async findTopPlaylist(): Promise<Result<Playlist[]>> {
        try {
            const playlistsCount = this.playlists.length;
            if (playlistsCount === 0) {
                return Result.fail(
                    null,
                    404,
                    'No se encontraron playlists',
                    new Error('No se encontraron playlists')
                );
            }
            const randomPlaylists: Playlist[] = [];
            const numberOfRandomPlaylists = Math.floor(Math.random() * playlistsCount) + 1;
            for (let i = 0; i < numberOfRandomPlaylists; i++) {
                const randomIndex = Math.floor(Math.random() * playlistsCount);
                randomPlaylists.push(this.playlists[randomIndex]);
            }
            return Result.success(randomPlaylists, 200);
        } catch (error) {
            return Result.fail(
                null,
                500,
                error.message || 'Error simulado al obtener las playlists top',
                error,
            );
        }
    }

    async findPlaylistsByName(name: string, limit?: number, offset?: number): Promise<Result<Playlist[]>> {
        const playlists: Playlist[] = []
        for (let i = 0; i < this.playlists.length; i++) {
            const playlist = this.playlists[i];
            if (playlist.Name.Name.includes(name)) {
                playlists.push(playlist)
            }
        }
        if (playlists.length > 0) {
            return Result.success(playlists, 200);
        } else {
            return Result.fail(null, 404, 'No se encontraron playlists', new Error('No se encontraron playlists'));
        }
    }

    static create() {
        return new PlaylistRepositoryMock();
    }

    async PushPlaylist(playlist: Playlist){
        this.playlists.push(playlist);
    }
}