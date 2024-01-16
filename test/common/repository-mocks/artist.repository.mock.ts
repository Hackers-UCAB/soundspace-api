import { Result } from "src/common/domain/result-handler/result";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { SongId } from "src/song/domain/value-objects/song-id";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { Artist } from "src/artist/domain/artist";

export class ArtistRepositoryMock implements IArtistRepository {

    private artistMap: Map<Artist, boolean> = new Map();
    private readonly artists: Artist[] = [];

    async findArtistById(id: ArtistId): Promise<Result<Artist>> {

        const artist = this.artists.find(artist => artist.Id.Id === id.Id);

        if (!artist) {
            return Result.fail<Artist>(
                null,
                404,
                'Artist not found',
                new Error('Artist not found')
            );
        }

        return Result.success<Artist>(artist, 200);

    }

    async findArtistsBySongId(songId: SongId): Promise<Result<Artist[]>> {

        const artists: Artist[] = [];

        for (let i = 0; i < this.artists.length; i++) {
            const artist = this.artists[i];
            artist.Songs.Songs.forEach(song => {
                if (song === songId) {
                    artists.push(artist);
                }
            });
        }

        return Result.success<Artist[]>(artists, 200);

    }

    async findArtistsByAlbumId(albumId: AlbumId): Promise<Result<Artist[]>> {

        const artists: Artist[] = [];

        for (let i = 0; i < this.artists.length; i++) {
            const artist = this.artists[i];
            artist.Albums.Albums.forEach(album => {
                if (album === albumId) {
                    artists.push(artist);
                }
            });
        }

        return Result.success<Artist[]>(artists, 200);

    }

    async findTrendingArtists(): Promise<Result<Artist[]>> {

        const trendingArtists = Array.from(this.artistMap.entries())
            .filter(([artist, trending]) => trending)
            .map(([artist, trending]) => artist);

        if (trendingArtists.length > 0) {
            return Result.success(trendingArtists, 200);
        } else {
            return Result.fail(
                null,
                404,
                'No existe el artista solicitado',
                new Error('Artist not found')
            );
        }

    }

    async findArtistsByName(name: string, limit?: number, offset?: number): Promise<Result<Artist[]>> {

        const artists: Artist[] = [];

        for (let i = 0; i < this.artists.length; i++) {
            const artist = this.artists[i];
            if (artist.Name.Name.includes(name)) {
                artists.push(artist)
            }
        }

        return Result.success<Artist[]>(artists, 200);
        
    }

    async save(artist: Artist): Promise<Result<string>> {
        this.artists.push(artist);
        return Result.success('Artista guardado correctamente', 200);
    }

    async saveMap(artist: Artist, trending: boolean = false): Promise<Result<string>> {
        this.artistMap.set(artist, trending);
        return Result.success('Artista guardado correctamente', 200);
    }

    static create() {
        return new ArtistRepositoryMock();
    }

}