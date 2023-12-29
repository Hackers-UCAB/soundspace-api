import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IPlaylistRepository } from 'src/playlist/domain/repositories/playlist.repository.interface';
import { Playlist } from '../../domain/playlist';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { OrmPlaylistMapper } from '../mapper/orm-playlist.mapper';
import { PlaylistId } from '../../domain/value-objects/playlist-id';
import { throwError } from 'rxjs';




export class PlaylistRepository extends Repository<OrmPlaylistEntity> implements IPlaylistRepository {

    private readonly OrmPlaylistMapper: OrmPlaylistMapper;
    constructor(dataSource: DataSource) {
        super(OrmPlaylistEntity, dataSource.createEntityManager());
        this.OrmPlaylistMapper = new OrmPlaylistMapper();
    }

    /*
    //retornar aggregate o map
    async findPlaylistById(PlaylistIdEntryApplicationDto: GetPlaylistByIdEntryApplicationDto): Promise<Result<PlaylistResponseApplicationDto>> {
        console.log('codigo_playlist: ', PlaylistIdEntryApplicationDto.PlaylistId);
        const playlist = await this.findOne(
            {
                where: {
                    codigo_playlist: PlaylistIdEntryApplicationDto.PlaylistId
                },
                select: ['codigo_playlist', 'nombre', 'referencia_imagen', 'tipo', 'trending']
            });

        //console.log('codigo_playlist: ', playlist.codigo_playlist, playlist.nombre);
        const playlistMapper = new OrmPlaylistMapper();

        const playlistDomain = await playlistMapper.toDomain(playlist);
        //console.log('codigo_playlist2 : ', playlistDomain.Id, playlistDomain.Name);

        const totalDuration = await this.createQueryBuilder('playlist')
            .leftJoin('playlist.canciones', 'playlist_cancion')
            .leftJoin('playlist_cancion.cancion', 'cancion')
            .where('playlist.codigo_playlist = :playlistId', { playlistId: PlaylistIdEntryApplicationDto.PlaylistId })
            .select('SUM(cancion.duracion)', 'duracion_total')
            .getRawOne();

        //console.log('Duración total de las canciones en la playlist:', totalDuration.duracion_total);
        const playlistResponse: PlaylistResponseApplicationDto = {
            userId: "userId",
            id: playlistDomain.Id.Id,
            name: playlistDomain.Name.Name,
            cover: playlistDomain.Cover.Path,
            duration: totalDuration.duracion_total
        };

        return Result.success(playlistResponse, 200);
    }


    */


    async findPlaylistById(id: PlaylistId): Promise<Result<Playlist>> {
        let response: Playlist;
        let error: Error;

        try {
            //realizamos el query, aqui el unico join es con la tabla de playlistCancion para obtener los ids de las canciones
            //no se hace con los creadores porque nuestra entity Playlist de dominio no tiene dicho atributo
            const playlist = await this.createQueryBuilder("playlist")
                .select(["playlist.codigo_playlist", "playlist.nombre", "playlist.referencia_imagen", "cancion.codigo_cancion"])
                .innerJoinAndSelect("playlist.canciones", "playlistCancion")
                .innerJoinAndSelect("playlistCancion.cancion", "cancion")
                //.where("playlist.tipo = 'playlist'")
                .where("playlist.codigo_playlist = :id", { id: id.Id })
                .getOne();
            /*
            console.log("playlist: ", playlist);
            console.log("nombre: ", playlist.nombre);
            console.log("canciones: ", playlist.canciones);
            */
            //mapeamos el resultado
            response = await this.OrmPlaylistMapper.toDomain(playlist);


        } catch (e) {
            error = e;
        } finally {
            if (error) {
                return Result.fail(
                    null,
                    500,
                    error.message ||
                    'Ha ocurrido un error inesperado obteniendo la playlist, hable con el administrador',
                    error
                );
            }
            return Result.success<Playlist>(response, 200);
        }
    }

    async findTopPlaylist(): Promise<Result<Playlist[]>> {
        let response: Playlist[];
        let error: Error;

        try {
            //realizamos el query, aqui el unico join es con la tabla de playlistCancion para obtener los ids de las canciones
            //no se hace con los creadores porque nuestra entity Playlist de dominio no tiene dicho atributo
            const playlists = await this.createQueryBuilder("playlist")
                .select(["playlist.codigo_playlist", "playlist.nombre", "playlist.referencia_imagen", "cancion.codigo_cancion"])
                .innerJoinAndSelect("playlist.canciones", "playlistCancion")
                .innerJoinAndSelect("playlistCancion.cancion", "cancion")
                .where("playlist.trending = :trending", { trending: true })
                .getMany();
            /*
            console.log("playlist: ", playlist);
            console.log("nombre: ", playlist.nombre);
            console.log("canciones: ", playlist.canciones);
            */
            //mapeamos el resultado
            response = await Promise.all(playlists.map(async (playlist) => await this.OrmPlaylistMapper.toDomain(playlist)));

        } catch (e) {
            error = e;
        } finally {
            if (error) {
                return Result.fail(
                    null,
                    500,
                    error.message ||
                    'Ha ocurrido un error inesperado obteniendo la playlist, hable con el administrador',
                    error
                );
            }
            return Result.success<Playlist[]>(response, 200);
        }

    }

}
