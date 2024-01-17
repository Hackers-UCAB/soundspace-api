import { InvalidToDomainMapper } from 'src/common/application/mappers/exceptions/invalid-to-domain-mapper.exception';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OdmPlaylistEntity } from 'src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity';
import { Playlist } from 'src/playlist/domain/playlist';
import { PlaylistCover } from 'src/playlist/domain/value-objects/playlist-cover';
import { PlaylistId } from 'src/playlist/domain/value-objects/playlist-id';
import { PlaylistName } from 'src/playlist/domain/value-objects/playlist-name';
import { PlaylistSong } from 'src/playlist/domain/value-objects/playlist-songs';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class OdmPlaylistMapper implements IMapper<Playlist, OdmPlaylistEntity> {
  async toDomain(persistence: OdmPlaylistEntity): Promise<Playlist> {
    if (persistence) {
      try {
        const songsIds = persistence.canciones.map((song) =>
          SongId.create(song),
        );
        const playlist: Playlist = Playlist.create(
          PlaylistId.create(persistence.codigo_playlist),
          PlaylistName.create(persistence.nombre),
          PlaylistCover.create(persistence.referencia_imagen),
          PlaylistSong.create(songsIds),
        );
        return playlist;
      } catch (error) {
        throw new InvalidToDomainMapper(
          error.message
            ? error.message
            : 'Ha ocurrido un error mapeando la playlist',
        );
      }
    }
    return null;
  }
  toPersistence(domain: Playlist): Promise<OdmPlaylistEntity> {
    throw new Error('Method not implemented.');
  }
}
