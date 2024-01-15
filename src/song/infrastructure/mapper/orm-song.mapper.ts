import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OrmCancionEntity } from "../orm-entities/song.entity";
import { Song } from "src/song/domain/song";
import { SongId } from "src/song/domain/value-objects/song-id";
import { SongName } from "src/song/domain/value-objects/song-name";
import { SongDuration } from "src/song/domain/value-objects/song-duration";
import { SongUrl } from "src/song/domain/value-objects/song-url";
import { SongCover } from "src/song/domain/value-objects/song-cover";
import { SongGenres } from "src/song/domain/value-objects/song-genre";
import { SongPreviewUrl } from "src/song/domain/value-objects/song-preview-url";
import { InvalidToDomainMapper } from "../../../common/application/mappers/exceptions/invalid-to-domain-mapper.exception";

export class OrmSongMapper implements IMapper<Song, OrmCancionEntity> {

    async toDomain(persistence: OrmCancionEntity): Promise<Song> {
        if (persistence) {
            const genres = persistence.generos.map(genre => genre.nombre_genero);

            const song: Song = await Song.create(
                SongId.create(persistence.codigo_cancion),
                SongName.create(persistence.nombre_cancion),
                SongUrl.create(persistence.referencia_cancion),
                SongCover.create(persistence.referencia_imagen),
                SongGenres.create(genres),
                SongDuration.create(persistence.duracion),
                SongPreviewUrl.create(persistence.referencia_preview)
            );
            return song;
        }
        throw InvalidToDomainMapper;
    }

    toPersistence(domain: Song): Promise<OrmCancionEntity> {
        throw new Error("Method not implemented.");
    }

}
