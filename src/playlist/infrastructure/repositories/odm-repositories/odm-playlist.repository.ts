import { Model } from 'mongoose';
import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { OdmPlaylistEntity } from 'src/common/infrastructure/persistence-entities/odm-entities/odm-playlist.entity';
import { Playlist } from 'src/playlist/domain/playlist';
import { IPlaylistRepository } from 'src/playlist/domain/repositories/playlist.repository.interface';
import { PlaylistId } from 'src/playlist/domain/value-objects/playlist-id';

export class OdmPlaylistRepository implements IPlaylistRepository {
  private readonly odmPlaylistMapper: IMapper<Playlist, OdmPlaylistEntity>;
  private readonly playlistModel: Model<OdmPlaylistEntity>;
  constructor(
    odmPlaylistMapper: IMapper<Playlist, OdmPlaylistEntity>,
    playlistModel: Model<OdmPlaylistEntity>,
  ) {
    this.odmPlaylistMapper = odmPlaylistMapper;
    this.playlistModel = playlistModel;
  }
  async findPlaylistById(playlistId: PlaylistId): Promise<Result<Playlist>> {
    let response: Playlist;
    let error: any;
    try {
      const playlist = await this.playlistModel.findOne({
        codigo_playlist: playlistId.Id, tipo: 'Playlist',
      });
      
      response = await this.odmPlaylistMapper.toDomain(playlist);
    } catch (err) {
      error = err;
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
    let error: any;
    try {
      const playlists = await this.playlistModel.find(
        {
          tipo: 'Playlist',
          trending: true,
        },
        {
          codigo_playlist: 1,
          nombre: 1,
          referencia_imagen: 1,
          canciones: 1,
        },
      );
      response = await Promise.all(
        playlists.map(
          async (playlist) => await this.odmPlaylistMapper.toDomain(playlist),
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
  findPlaylistsByName(
    name: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Playlist[]>> {
    throw new Error('Method not implemented.');
  }
}
