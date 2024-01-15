import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { Playlist } from '../../domain/playlist';
import { PlaylistId } from '../../domain/value-objects/playlist-id';
import { PlaylistName } from '../../domain/value-objects/playlist-name';
import { PlaylistCover } from '../../domain/value-objects/playlist-cover';
import { PlaylistSong } from '../../domain/value-objects/playlist-songs';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidToDomainMapper } from '../../../common/application/mappers/exceptions/invalid-to-domain-mapper.exception';

export class OrmPlaylistMapper implements IMapper<Playlist, OrmPlaylistEntity> {

  async toDomain(persistence: OrmPlaylistEntity): Promise<Playlist> {

    if (persistence) {
      try {
        const songsIds = persistence.canciones.map(song => SongId.create(song.cancion.codigo_cancion));

        const playlist: Playlist = await Playlist.create(
          PlaylistId.create(persistence.codigo_playlist),
          PlaylistName.create(persistence.nombre),
          PlaylistCover.create(persistence.referencia_imagen),
          PlaylistSong.create(songsIds)
        );
        return playlist;
      } catch (error: any) {
        throw new InvalidToDomainMapper(
          error.message
            ? error.message
            : 'Ha ocurrido un error mapeando la playlist',
        );
      }
    }
      return null;
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
