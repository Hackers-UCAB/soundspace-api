import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { Playlist } from '../../domain/playlist';
import { PlaylistId } from '../../domain/value-objects/playlist-id';
import { PlaylistName } from '../../domain/value-objects/playlist-name';
import { PlaylistCover } from '../../domain/value-objects/playlist-cover';
import { PlaylistSong } from '../../domain/value-objects/playlist-songs';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidToDomainMapper } from '../exceptions/invalid-to-domaim-mapper.exception';

export class OrmPlaylistMapper implements IMapper<Playlist, OrmPlaylistEntity> {

    async toDomain(persistence: OrmPlaylistEntity): Promise<Playlist> {
        if (persistence) {
            const songsIds = persistence.canciones.map(song => SongId.create(song.cancion.codigo_cancion));

            const playlist: Playlist = await Playlist.create(
                new PlaylistId(persistence.codigo_playlist),
                new PlaylistName(persistence.nombre),
                new PlaylistCover(persistence.referencia_imagen),
                new PlaylistSong(songsIds)
            );
            return playlist;
        }
        throw InvalidToDomainMapper;
    }
    
    async toPersistence(domain: Playlist): Promise<OrmPlaylistEntity> {
        if (domain) {

            const playlist = OrmPlaylistEntity.create(
                domain.Id.Id,
                domain.Name.Name,
                domain.Cover.Path,
            );

            return playlist;
        }
        return null;
    }
}
