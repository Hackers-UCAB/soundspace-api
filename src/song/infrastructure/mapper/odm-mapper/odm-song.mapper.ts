import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Song } from "src/song/domain/song";
import { OdmSongEntity } from "../../persistence-entities/odm-entities/odm-song.entity";


export class OdmSongMapper implements IMapper<Song, OdmSongEntity>{
    toDomain(persistence: OdmSongEntity): Promise<Song> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: Song): Promise<OdmSongEntity> {
        throw new Error("Method not implemented.");
    }
    
}