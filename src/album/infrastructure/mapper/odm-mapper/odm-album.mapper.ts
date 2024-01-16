import { Album } from "src/album/domain/album";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OdmPlaylistEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity";


export class OdmAlbumMapper implements IMapper<Album, OdmPlaylistEntity>{
    toDomain(persistence: OdmPlaylistEntity): Promise<Album> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: Album): Promise<OdmPlaylistEntity> {
        throw new Error("Method not implemented.");
    }
    
}