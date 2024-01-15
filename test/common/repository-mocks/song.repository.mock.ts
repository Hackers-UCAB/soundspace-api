import { Result } from "src/common/domain/result-handler/result";
import { PartialSong } from "src/song/domain/parameter-object/partial-song.parameter.object";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { Song } from "src/song/domain/song";
import { SongId } from "src/song/domain/value-objects/song-id";



export class SongRepositoryMock implements ISongRepository {
    private songs: Song[] = []
    findSongById(id: SongId): Promise<Result<Song>> {
        throw new Error("Method not implemented.");
    }
    findSongUrlById(id: string): Promise<Result<SongId>> {
        throw new Error("Method not implemented.");
    }
    findTopSongs(): Promise<Result<Song[]>> {
        throw new Error("Method not implemented.");
    }
    findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>> {
        throw new Error("Method not implemented.");
    }
    findUrl(id: SongId): Promise<Result<PartialSong>> {
        throw new Error("Method not implemented.");
    }
    findPreview(id: SongId): Promise<Result<PartialSong>> {
        throw new Error("Method not implemented.");
    }

    save(song: Song): Result<string> {
        this.songs.push(song);
        return Result.success('Guardado correctamente', 200);
    }

    static create() {
        return new SongRepositoryMock();
    }


}