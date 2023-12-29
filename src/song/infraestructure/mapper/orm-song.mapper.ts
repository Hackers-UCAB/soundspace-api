import { Song } from "src/song/domain/song";
import { OrmCancionEntity } from "../orm-entities/song.entity";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { SongId } from "src/song/domain/value-objects/song-id";
import { SongName } from "src/song/domain/value-objects/song-name";
import { SongUrl } from "src/song/domain/value-objects/song-url";
import { SongCover } from "src/song/domain/value-objects/song-cover";
import { SongGenre } from "src/song/domain/value-objects/song-genre";
import { OrmGeneroEntity } from "src/common/infraestructure/orm-entities/genre.entity";
import { SongDuration } from "src/song/domain/value-objects/song-duration";
import { SongPreviewUrl } from "src/song/domain/value-objects/song-preview-url";

export class OrmSongMapper implements IMapper<Song, OrmCancionEntity>{

    async toDomain(persistence: OrmCancionEntity): Promise<Song> {
        let array: string[]
        persistence.generos.forEach(function (genero){
            array.push(String(genero))
        })
        if (persistence) {
            const song: Song = await Song.create(
                SongId.create(persistence.codigo_cancion),
                SongName.create(persistence.nombre_cancion),
                SongUrl.create(persistence.referencia_cancion),
                SongCover.create(persistence.referencia_imagen),
                SongGenre.create(array),
                SongDuration.create(persistence.duracion),
                SongPreviewUrl.create(persistence.referencia_preview)
            );
            return song;
        }
        return null;
    }

    async toPersistence(domain: Song): Promise<OrmCancionEntity> {
        if (domain) {
            const song = await OrmCancionEntity.create(
                domain.Id.Id,
                domain.Name.Name,
                domain.Url.Path,
                domain.Cover.Path,
                domain.Duration.Duration,
                domain.PreviewUrl.Path
            );
            return song;
        }
        return null;    
    }
}