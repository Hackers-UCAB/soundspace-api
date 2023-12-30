import { ArtistId } from '../../../artist/domain/value-objects/artist-id';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { AlbumId } from '../../domain/value-objects/album-id';
import { GetAlbumByIdEntryApplicationDto } from '../dto/entries/get-album-by-id-entry.application.dto';
import { GetAlbumByIdResponseApplicationDto } from '../dto/responses/get-album-by-id-response.application.dto';

export class GetAlbumByIdService
  implements
    IApplicationService<
      GetAlbumByIdEntryApplicationDto,
      GetAlbumByIdResponseApplicationDto
    >
{
  private readonly AlbumRepository: IAlbumRepository;
  songRepository: any;

  constructor(AlbumRepository: IAlbumRepository) {
    this.AlbumRepository = AlbumRepository;
  }

  async execute(
    param: GetAlbumByIdEntryApplicationDto,
  ): Promise<Result<GetAlbumByIdResponseApplicationDto>> {
      /*
    console.log('param: ', param);
    //creamos el value object de Playlist Id
    const albumId = AlbumId.create(param.albumId);

    console.log('albumId: ', albumId);
    //buscamos en el repositorio la playlist por id
    const albumResult = await this.AlbumRepository.findAlbumById(albumId);
    console.log('albumResult: ', albumResult);
    if (!albumResult.IsSuccess) {
      return Result.fail<GetAlbumByIdResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }
    */
      
       //console.log('param: ', param);
       //creamos el value object de Playlist Id
       const albumId = AlbumId.create(param.albumId);

       console.log('probando  albumId: ', albumId);
      //buscamos en el repositorio la playlist por id
      const albumResult = await this.AlbumRepository.findAlbumsByArtist(new ArtistId('808da108-1dbc-4214-9e7c-fe7cfccd5285'));
       console.log('albumResult: ', albumResult);
       if (!albumResult.IsSuccess) {
         return Result.fail<GetAlbumByIdResponseApplicationDto>(
           null,
           albumResult.statusCode,
           albumResult.message,
           albumResult.error,
         );
       }
   

    //return Result.success<GetPlaylistByIdResponseApplicationDto>(playlistResult.Data, playlistResult.statusCode);

    /*
    //buscamos todas las canciones relacionadas a ese playlist para crear el songResponseDto
    for (const songId of playlistResult.data.PlaylistSongs.Songs) {
        const song = await this.songRepository.findSongById(songId);
        if (!song.IsSuccess) {
            return Result.fail<GetPlaylistByIdResponseApplicationDto>(null, song.statusCode, song.message, song.error);
        }
        //buscamos al artista de la cancion
        const artist = await this.artistRepository.findArtistBySongId(songId);
        console.log("songId: ", songId);
    }
    */
  }
}
