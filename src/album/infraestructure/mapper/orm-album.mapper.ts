import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { OrmGeneroEntity } from 'src/common/infraestructure/orm-entities/genre.entity';
import { Album } from '../../domain/album';
import { AlbumId } from '../../domain/value-objects/album-id';
import { AlbumName } from '../../domain/value-objects/album-name';
import { AlbumCover } from '../../domain/value-objects/album-cover';
import { AlbumSongs } from '../../domain/value-objects/album-songs';
import { AlbumDuration } from '../../domain/value-objects/album-duration';
import { AlbumGenre } from '../../domain/value-objects/album-genre';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { InvalidToDomainMapper } from '../../../common/infraestructure/exceptions/invalid-to-domain-mapper.exception';

export class OrmAlbumMapper implements IMapper<Album, OrmPlaylistEntity> {
  async toDomain(persistence: OrmPlaylistEntity): Promise<Album> {
    if (persistence) {
      try {
        const songsIds = persistence.canciones
          ? persistence.canciones.map((song) =>
              SongId.create(song.cancion.codigo_cancion),
            )
          : [];

        const genreName =
          persistence.genero && persistence.genero.nombre_genero
            ? persistence.genero.nombre_genero
            : 'Sin Género';

        const album: Album = await Album.create(
          AlbumId.create(persistence.codigo_playlist),
          AlbumName.create(persistence.nombre),
          AlbumCover.create(persistence.referencia_imagen),
          AlbumSongs.create(songsIds),
          AlbumGenre.create(genreName),
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
