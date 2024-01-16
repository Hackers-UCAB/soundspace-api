import { Artist } from "src/artist/domain/artist";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OdmArtistEntity } from "../../persistence-entities/odm-entities/odm-artist.entity";


export class OdmArtistMapper implements IMapper<Artist, OdmArtistEntity>{
    toDomain(persistence: OdmArtistEntity): Promise<Artist> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: Artist): Promise<OdmArtistEntity> {
        throw new Error("Method not implemented.");
    }
    
}