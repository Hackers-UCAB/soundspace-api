import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/domain/result-handler/result';
import { IPlaylistRepository } from 'src/playlist/domain/repositories/playlist.repository.interface';
import { Playlist } from '../../../domain/playlist';
import { OrmPlaylistEntity } from '../../../../common/infrastructure/persistence-entities/orm-entities/orm-playlist.entity';
import { PlaylistId } from '../../../domain/value-objects/playlist-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';

export class OrmPlaylistRepository
  extends Repository<OrmPlaylistEntity>
  implements IPlaylistRepository
{
  private readonly ormPlaylistMapper: IMapper<Playlist, OrmPlaylistEntity>;
  constructor(
    dataSource: DataSource,
    ormPlaylistMapper: IMapper<Playlist, OrmPlaylistEntity>,
  ) {
    super(OrmPlaylistEntity, dataSource.createEntityManager());
    this.ormPlaylistMapper = ormPlaylistMapper;
  }

  async findPlaylistById(playlistId: PlaylistId): Promise<Result<Playlist>> {
    let response: Playlist;
    let error: any;
    try {
      //se realiza la consulta a la base de datos
      const playlist = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where(
          "playlist.codigo_playlist = :id and playlist.tipo = 'Playlist' or playlist.tipo = 'playlist'",
          { id: playlistId.Id },
        )
        .getOne();
      //la respuesta de la base de datos se mapea
      response = await this.ormPlaylistMapper.toDomain(playlist);
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
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe la playlist solicitada',
          new Error('No existe la playlist solicitada'),
        );
      }
      return Result.success<Playlist>(response, 200);
    }
  }

  async findTopPlaylist(): Promise<Result<Playlist[]>> {
    let response: Playlist[];
    let error: Error;
    try {
      //se realiza la consulta a la base de datos
      const playlists = await this.createQueryBuilder('playlist')
        .select([
          'playlist.codigo_playlist',
          'playlist.nombre',
          'playlist.referencia_imagen',
          'cancion.codigo_cancion',
        ])
        .innerJoinAndSelect('playlist.canciones', 'playlistCancion')
        .innerJoinAndSelect('playlistCancion.cancion', 'cancion')
        .where("playlist.tipo = 'Playlist' and playlist.trending = true")
        .getMany();
      //la respuesta de la base de datos se mapea
      response = await Promise.all(
        playlists.map(
          async (playlist) => await this.ormPlaylistMapper.toDomain(playlist),
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
      // Filtrar los elementos nulos del array 'response'
      response = response.filter((playlists) => playlists !== null);
      // Verificar si el array 'response' es nulo
      if (response === null || response.length === 0) {
        return Result.fail(
          null,
          404,
          'No se encontraron playlists top',
          new Error('No se encontraron playlists top'),
        );
      }
      return Result.success<Playlist[]>(response, 200);
    }
  }

  async findPlaylistsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Playlist[]>> {
    let response: Playlist[];
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

      let finalPlaylist: OrmPlaylistEntity[] = playlists.slice(
        offset,
        offset + limit,
      );
      response = await Promise.all(
        finalPlaylist.map(
          async (playlist) => await this.ormPlaylistMapper.toDomain(playlist),
        ),
      );
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado buscnado la playlists, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No se encontr� la playlist con el nombre solicitado',
          new Error('No se encontr� la playlist con el nombre solicitado'),
        );
      }
      return Result.success<Playlist[]>(response, 200);
    }
  }
}
