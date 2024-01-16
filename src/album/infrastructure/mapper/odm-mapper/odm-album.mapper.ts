import { Album } from "src/album/domain/album";
import { AlbumCover } from "src/album/domain/value-objects/album-cover";
import { AlbumGenre } from "src/album/domain/value-objects/album-genre";
import { AlbumId } from "src/album/domain/value-objects/album-id";
import { AlbumName } from "src/album/domain/value-objects/album-name";
import { AlbumSongs } from "src/album/domain/value-objects/album-songs";
import { InvalidToDomainMapper } from "src/common/application/mappers/exceptions/invalid-to-domain-mapper.exception";
import { IMapper } from "src/common/application/mappers/mapper.interface";
import { OdmPlaylistEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity";
import { SongId } from "src/song/domain/value-objects/song-id";


export class OdmAlbumMapper implements IMapper<Album, OdmPlaylistEntity>{
    async toDomain(persistence: OdmPlaylistEntity): Promise<Album> {
        if (persistence) {
            try {
                
                const songsIds = persistence.canciones
                    ? persistence.canciones.map((song) =>
                        SongId.create(song),
                    )
                    : [];
                const album: Album = await Album.create(
                    AlbumId.create(persistence.codigo_playlist),
                    AlbumName.create(persistence.nombre),
                    AlbumCover.create(persistence.referencia_imagen),
                    AlbumSongs.create(songsIds),
                    AlbumGenre.create(persistence.generoRef[0]),
                );
                return album;
            } catch (error: any) {
                throw new InvalidToDomainMapper(
                    error.message
                        ? error.message
                        : 'Ha ocurrido un error mapeando el album',
                );
            }
        }
        return null;
    }
    toPersistence(domain: Album): Promise<OdmPlaylistEntity> {
        throw new Error("Method not implemented.");
    }
    
}