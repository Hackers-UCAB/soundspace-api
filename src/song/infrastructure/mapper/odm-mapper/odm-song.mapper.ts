import { IMapper } from "src/common/application/mappers/mapper.interface";
import { Song } from "src/song/domain/song";
import { OdmSongEntity } from "../../persistence-entities/odm-entities/odm-song.entity";
import { SongId } from "src/song/domain/value-objects/song-id";
import { SongCover } from "src/song/domain/value-objects/song-cover";
import { SongDuration } from "src/song/domain/value-objects/song-duration";
import { SongGenres } from "src/song/domain/value-objects/song-genre";
import { SongName } from "src/song/domain/value-objects/song-name";
import { SongPreviewUrl } from "src/song/domain/value-objects/song-preview-url";
import { SongUrl } from "src/song/domain/value-objects/song-url";


export class OdmSongMapper implements IMapper<Song, OdmSongEntity>{
    async toDomain(persistence: OdmSongEntity): Promise<Song> {
        if (persistence){
            const genero: string = persistence.generosRef[0].toString();
            const song: Song = await Song.create(
                SongId.create(persistence.codigo_cancion),
                SongName.create(persistence.nombre_cancion),
                SongUrl.create(persistence.referencia_cancion),
                SongCover.create(persistence.referencia_imagen),
                SongGenres.create([genero]),
                SongDuration.create(persistence.duracion),
                SongPreviewUrl.create(persistence.referencia_preview)
            );
            return song;
        }
        return null;
    }
    toPersistence(domain: Song): Promise<OdmSongEntity> {
        throw new Error("Method not implemented.");
    }
    
}