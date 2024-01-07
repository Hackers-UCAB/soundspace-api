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
import { InvalidToDomainMapper } from '../exceptions/invalid-to-domain-mapper.exception';
import { AlbumId } from 'src/album/domain/value-objects/album-id';

export class OrmArtistMapper implements IMapper<Artist, OrmArtistaEntity> {

    async toDomain(persistence: OrmArtistaEntity): Promise<Artist> {

        if (persistence) {

            const songs = persistence.canciones.map
                (song => SongId.create(song.codigo_cancion));

            const albums = persistence.playlistCreadores.map
                (playlist_creador => AlbumId.create
                    (playlist_creador.playlist.codigo_playlist))

            const genreName =
                persistence.genero && persistence.genero.nombre_genero
                    ? persistence.genero.nombre_genero
                    : 'Sin Género';

            const artist: Artist = await Artist.create(
                ArtistId.create(persistence.codigo_artista),
                ArtistName.create(persistence.nombre_artista),
                ArtistGenre.create(genreName),
                ArtistPhoto.create(persistence.referencia_imagen),
                ArtistAlbums.create(albums),
                ArtistSongs.create(songs)
            );

            return artist;
        }

        throw InvalidToDomainMapper;
    }

    async toPersistence(domain: Artist): Promise<OrmArtistaEntity> {
        return null;
    }

}