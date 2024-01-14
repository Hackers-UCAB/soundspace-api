import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmArtistaEntity } from '../../../artist/infraestructure/orm-entities/artist.entity';
import { Artist } from '../../domain/artist';
import { ArtistId } from '../../domain/value-objects/artist-id';
import { ArtistName } from '../../domain/value-objects/artist-name';
import { ArtistGenre } from '../../domain/value-objects/artist-genre';
import { ArtistPhoto } from '../../domain/value-objects/artist-photo';
import { ArtistAlbums } from '../../domain/value-objects/artist-albums';
import { ArtistSongs } from '../../domain/value-objects/artist-songs';
import { SongId } from '../../../song/domain/value-objects/song-id';
import { AlbumId } from 'src/album/domain/value-objects/album-id';
import { InvalidToDomainMapper } from 'src/common/infraestructure/exceptions/invalid-to-domain-mapper.exception';

export class OrmArtistMapper implements IMapper<Artist, OrmArtistaEntity> {
  
  async toDomain(persistence: OrmArtistaEntity): Promise<Artist> {
    
    if (persistence) {
      try {
        let songs: SongId[];
        if (persistence.canciones) {
          songs = persistence.canciones.map((song) =>
            SongId.create(song.codigo_cancion),
          );
        }

        let albums: AlbumId[];
        if (persistence.playlistCreadores) {
          albums = persistence.playlistCreadores.map((playlist_creador) =>
            AlbumId.create(playlist_creador.playlist.codigo_playlist),
          );
        }

        const genreName =
          persistence.genero && persistence.genero.nombre_genero
            ? persistence.genero.nombre_genero
            : 'Sin Género';

        const artist: Artist = await Artist.create(
          ArtistId.create(persistence.codigo_artista),
          ArtistName.create(persistence.nombre_artista),
          ArtistGenre.create(genreName),
          ArtistPhoto.create(persistence.referencia_imagen),
          persistence.canciones ? ArtistSongs.create(songs) : null,
          persistence.playlistCreadores ? ArtistAlbums.create(albums) : null,
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

  async toPersistence(domain: Artist): Promise<OrmArtistaEntity> {
    return null;
  }
}
