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

    async findPlaylistById(id: PlaylistId): Promise<Result<Playlist>> {
        let response: Playlist;
        let error: Error;
        try {
            const playlist = await this.createQueryBuilder("playlist")
                .select(["playlist.codigo_playlist", "playlist.nombre", "playlist.referencia_imagen", "cancion.codigo_cancion"])
                .innerJoinAndSelect("playlist.canciones", "playlistCancion")
                .innerJoinAndSelect("playlistCancion.cancion", "cancion")
                .where("playlist.codigo_playlist = :id and playlist.tipo = 'Playlist'", { id: id.Id })
                .getOne();
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
      const playlists = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where('playlist.trending = :trending', { trending: true })
        .where("playlist.tipo = 'Playlist'")
        .getMany();
      /*
            console.log("playlist: ", playlist);
            console.log("nombre: ", playlist.nombre);
            console.log("canciones: ", playlist.canciones);
            */
      //mapeamos el resultado
      response = await Promise.all(
        playlists.map(
          async (playlist) => await this.OrmPlaylistMapper.toDomain(playlist),
        ),
      );
    } catch (e) {
      error = e;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado obteniendo la playlist, hable con el administrador',
          error,
        );
      }
      return Result.success<Playlist[]>(response, 200);
    }
  }

  async findPlaylistsByName(name: string): Promise<Result<Playlist[]>> {
    let response: Playlist [];
    let error: any;
    try {
        const playlists = await this.createQueryBuilder('playlist')
        .leftJoinAndSelect('playlist.canciones', 'playlistCancion')
        .leftJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where(' LOWER(playlist.nombre) LIKE :name', {
            name: `%${name.toLowerCase()}%`,
          })
          .andWhere('playlist.tipo = :tipo', {
            tipo: 'Playlist',
          })
        .getMany();
        response = await Promise.all(
            playlists.map(
                async (playlist) => await this.OrmPlaylistMapper.toDomain(playlist),
            ),
        );
    } catch (err) {
        error = err;
    }finally {
        if (error) {
            return Result.fail(
                null,
                500,
                error.message ||
                    'Ha ocurrido un error inesperado buscnado la playlists, hable con el administrador',
                error,
            );
        }
        return Result.success<Playlist[]>(response, 200);
    }
  }
}
