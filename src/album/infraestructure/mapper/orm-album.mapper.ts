import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { Album } from '../../domain/album';
import { AlbumId } from '../../domain/value-objects/album-id';
import { AlbumName } from '../../domain/value-objects/album-name';
import { AlbumCover } from '../../domain/value-objects/album-cover';
import { AlbumSongs } from '../../domain/value-objects/album-songs';
import { AlbumDuration } from '../../domain/value-objects/album-duration';
import { AlbumGenre } from '../../domain/value-objects/album-genre';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidToDomainMapper } from '../exception/invalid-to-domain-mapper.exception';

export class OrmAlbumMapper implements IMapper<Album, OrmPlaylistEntity> {
  async toDomain(persistence: OrmPlaylistEntity): Promise<Album> {
    if (persistence) {
      const songsIds = persistence.canciones.map((song) =>
        SongId.create(song.cancion.codigo_cancion),
      );

      const album: Album = await Album.create(
        new AlbumId(persistence.codigo_playlist),
        new AlbumName(persistence.nombre),
        new AlbumCover(persistence.referencia_imagen),
        new AlbumSongs(songsIds),
        new AlbumGenre(null),
      );
      return album;
    }
    throw InvalidToDomainMapper;
  }

  async toPersistence(domain: Album): Promise<OrmPlaylistEntity> {
    if (domain) {
      const album = OrmPlaylistEntity.create(
        domain.Id.Id,
        domain.Name.Name,
        domain.Cover.Path,
      );

      return album;
    }
    return null;
  }
}
