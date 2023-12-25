import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { Playlist } from '../../domain/Playlist';
import { PlaylistId } from '../../domain/value-objects/playlist-id';
import { PlaylistName } from '../../domain/value-objects/playlist-name';
import { PlaylistCover } from '../../domain/value-objects/playlist-cover';

export class OrmPlaylistMapper implements IMapper<Playlist, OrmPlaylistEntity> {

    async toDomain(persistence: OrmPlaylistEntity): Promise<Playlist> {
        if (persistence) {
            const playlist: Playlist = await Playlist.create(
                PlaylistId.create(persistence.codigo_playlist),
                PlaylistName.create(persistence.nombre),
                PlaylistCover.create(persistence.referencia_imagen),
            );

            return playlist;
        }
        return null;
    }
    
    async toPersistence(domain: Playlist): Promise<OrmPlaylistEntity> {
        if (domain) {

            const playlist = OrmPlaylistEntity.create(
                domain.Id.Id,
                domain.Name.Name,
                domain.Cover.Path
            );

            return playlist;
        }
        return null;
    }
    
}
