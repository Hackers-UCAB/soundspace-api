import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IPlaylistRepository } from 'src/Playlist/domain/repositories/Playlist.repository.interface';
import { Playlist } from '../../domain/playlist';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';
import { PlaylistResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';
import { OrmPlaylistMapper } from '../mapper/orm-playlist.mapper';

export class PlaylistRepository extends Repository<OrmPlaylistEntity> implements IPlaylistRepository {

    private readonly OrmPlaylistMapper: OrmPlaylistMapper;
    constructor(dataSource: DataSource) {
        super(OrmPlaylistEntity, dataSource.createEntityManager());
        this.OrmPlaylistMapper = new OrmPlaylistMapper();
    }

    async findPlaylistById(PlaylistIdEntryApplicationDto: GetPlaylistByIdEntryApplicationDto): Promise<Result<PlaylistResponseApplicationDto>> {
        const playlist = await this.findOne(
            {
                where: {
                    codigo_playlist: PlaylistIdEntryApplicationDto.PlaylistId
                },
                select: ['codigo_playlist', 'nombre', 'referencia_imagen', 'tipo', 'trending']
            });

        const playlistMapper = new OrmPlaylistMapper();

        const playlistDomain = await playlistMapper.toDomain(playlist);

        // Retrieve the duration of the playlist from the other table
        const playlistDuration = await this.getPlaylistDuration(playlist.codigo_playlist);

        const playlistResponse: PlaylistResponseApplicationDto = {
            userId: "userId",
            id: playlistDomain.Id.Id,
            name: playlistDomain.Name.Name,
            cover: playlistDomain.Cover.Path,
            duration: playlistDuration
        };

        return Result.success(playlistResponse, 200);
    }

    async getPlaylistDuration(playlistId: string): Promise<string> {
        const playlistCanciones = await this.createQueryBuilder('playlist_cancion')
            .select('playlist_cancion.cancionCodigoCancion', 'cancionCodigoCancion')
            .where('playlist_cancion.playlistCodigoPlaylist = :playlistId', { playlistId })
            .getRawMany();

        const codigosCanciones = playlistCanciones.map((cancion) => cancion.cancionCodigoCancion);

        const canciones = await this.createQueryBuilder('cancion')
            .select('cancion.duracion', 'duracion')
            .where('cancion.codigo_cancion IN (:...codigosCanciones)', { codigosCanciones })
            .getRawMany();

        const duracionTotal = canciones.reduce((total, cancion) => {
            return total + cancion.duracion;
        }, 0);

        const horas = Math.floor(duracionTotal / 3600);
        const minutos = Math.floor((duracionTotal % 3600) / 60);
        const segundos = duracionTotal % 60;

        const duracion = `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        return duracion;
    }

    async findTopPlaylist(): Promise<Result<Playlist[]>> {
        throw new Error('Method not implemented.');
    }
}
