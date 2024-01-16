import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OdmPlaylistEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity";
import { Playlist } from "src/playlist/domain/playlist";


export class OdmPlaylistMapper implements IMapper<Playlist, OdmPlaylistEntity>{
    toDomain(persistence: OdmPlaylistEntity): Promise<Playlist> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: Playlist): Promise<OdmPlaylistEntity> {
        throw new Error("Method not implemented.");
    }
    
}