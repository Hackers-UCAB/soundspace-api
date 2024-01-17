import { Artist } from 'src/artist/domain/artist';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OdmArtistEntity } from '../../persistence-entities/odm-entities/odm-artist.entity';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { ArtistId } from 'src/artist/domain/value-objects/artist-id';
import { ArtistAlbums } from 'src/artist/domain/value-objects/artist-albums';
import { ArtistGenre } from 'src/artist/domain/value-objects/artist-genre';
import { ArtistName } from 'src/artist/domain/value-objects/artist-name';
import { ArtistPhoto } from 'src/artist/domain/value-objects/artist-photo';
import { ArtistSongs } from 'src/artist/domain/value-objects/artist-songs';
import { InvalidToDomainMapper } from 'src/common/application/mappers/exceptions/invalid-to-domain-mapper.exception';

export class OdmArtistMapper implements IMapper<Artist, OdmArtistEntity> {
  async toDomain(persistence: OdmArtistEntity): Promise<Artist> {
    if (persistence) {
      try {
        let songs: SongId[];
        if ((persistence.canciones) && (persistence.canciones.length > 0)) {
          songs = persistence.canciones.map((song) =>
            SongId.create(song),
          );
        }

        let albums: AlbumId[];
        if ((persistence.albums) && (persistence.albums.length > 0)) {
          albums = persistence.albums.map((album) =>
            AlbumId.create(album),
          );
        }
        const artist: Artist = await Artist.create(
          ArtistId.create(persistence.codigo_artista),
          ArtistName.create(persistence.nombre_artista),
          ArtistGenre.create(persistence.generoRef[0]),
          ArtistPhoto.create(persistence.referencia_imagen),
          songs ? ArtistSongs.create(songs) : null,
          albums ? ArtistAlbums.create(albums) : null,
        );
        return artist;
      } catch (error: any) {
        throw new InvalidToDomainMapper(
          error.message
            ? error.message
            : 'Ha ocurrido un error mapeando el artista',
        );
      }
    }
    return null;
  }
  toPersistence(domain: Artist): Promise<OdmArtistEntity> {
    throw new Error('Method not implemented.');
  }
}
