import { Album } from "src/album/domain/album";
import { IAlbumRepository } from "src/album/domain/repositories/album.repository.interface";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { ArtistId } from "src/artist/domain/value-objects/artist-id";
import { Result } from "src/common/domain/result-handler/result";

export class AlbumRepositoryMock implements IAlbumRepository {
    private readonly albums: Album[] = [];
    findAlbumById(albumId: AlbumId): Promise<Result<Album>> {
        throw new Error("Method not implemented.");
    }
    findTopAlbum(): Promise<Result<Album[]>> {
        throw new Error("Method not implemented.");
    }
    findAlbumsByArtist(artistId: ArtistId): Promise<Result<Album[]>> {
        throw new Error("Method not implemented.");
    }
    async findAlbumsByName(name: string, limit?: number, offset?: number): Promise<Result<Album[]>> {
        const albums: Album[] = [] 
        for (let i = 0; i < this.albums.length; i++) {
            const album = this.albums[i];
            if (album.Name.Name.includes(name)) { albums.push(album) }
        }

        if (albums.length > 0) {
            return Result.success(albums, 200);
        } else {
            return Result.fail(null, 404, 'No se encontraron albums', new Error('No se encontraron albums'));
        }
    }

    save(album: Album): Result<string> {
        this.albums.push(album);
        return Result.success('Guardado correctamente', 200);
    }
    static create(){
        return new AlbumRepositoryMock();
    }

}