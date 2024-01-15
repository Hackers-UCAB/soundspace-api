import { Result } from "src/common/domain/result-handler/result";
import { PartialSong } from "src/song/domain/parameter-object/partial-song.parameter.object";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { Song } from "src/song/domain/song";
import { SongId } from "src/song/domain/value-objects/song-id";
import { SongName } from "src/song/domain/value-objects/song-name";



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
    async findSongsByName(name: string, limit?: number, offset?: number): Promise<Result<Song[]>> {
        const songs: Song[] = [] 
        for (let i = 0; i < this.songs.length; i++) {
            const song = this.songs[i];
            if (song.Name.Name.includes(name)) { songs.push(song) }
        }

        if (songs.length > 0) {
            return Result.success(songs, 200);
        } else {
            return Result.fail(null, 404, 'No se encontraron canciones', new Error('No se encontraron canciones'));
        }
        
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