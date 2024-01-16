import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { PartialSong } from "src/song/domain/parameter-object/partial-song.parameter.object";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { Song } from "src/song/domain/song";
import { SongId } from "src/song/domain/value-objects/song-id";
import { OdmSongEntity } from "../../persistence-entities/odm-entities/odm-song.entity";
import { Model } from "mongoose";


export class OdmSongRepository implements ISongRepository{

    private readonly odmSongMapper: IMapper<Song, OdmSongEntity>;
    private readonly songModel: Model<OdmSongEntity>
    constructor(
        odmSongMapper: IMapper<Song, OdmSongEntity>,
        songModel: Model<OdmSongEntity>
    ){
        this.odmSongMapper = odmSongMapper;
        this.songModel = songModel;
    }

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
    
}