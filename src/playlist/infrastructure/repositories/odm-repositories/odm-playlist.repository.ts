import { Model } from "mongoose";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Result } from "src/common/domain/result-handler/result";
import { OdmPlaylistEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity";
import { Playlist } from "src/playlist/domain/playlist";
import { IPlaylistRepository } from "src/playlist/domain/repositories/playlist.repository.interface";
import { PlaylistId } from "src/playlist/domain/value-objects/playlist-id";


export class OdmPlaylistRepository implements IPlaylistRepository{
    private readonly odmPlaylistMapper: IMapper<Playlist, OdmPlaylistEntity>;
    private readonly playlistModel: Model<OdmPlaylistEntity>;
    constructor(
        odmPlaylistMapper: IMapper<Playlist, OdmPlaylistEntity>,
        playlistModel: Model<OdmPlaylistEntity>
    ){
        this.odmPlaylistMapper = odmPlaylistMapper;
        this.playlistModel = playlistModel;
    }
    findPlaylistById(GetPlaylistByIdEntryApplicationDto: PlaylistId): Promise<Result<Playlist>> {
        throw new Error("Method not implemented.");
    }
    findTopPlaylist(): Promise<Result<Playlist[]>> {
        throw new Error("Method not implemented.");
    }
    findPlaylistsByName(name: string, limit?: number, offset?: number): Promise<Result<Playlist[]>> {
        throw new Error("Method not implemented.");
    }
    
}