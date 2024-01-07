import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';
import { GetPlaylistByIdResponseApplicationDto } from '../../application/dto/responses/get-playlist-by-id-response.application.dto';
import { GetTopPlaylistResponseApplicationDto } from '../../application/dto/responses/get-top-playlist-response.application.dto';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/application/result-handler/result';
import { TopPlaylistEntryApplicationDto } from '../../application/dto/entrys/get-top-playlist-entry.application.dto';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { PlaylistInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/playlist.response.dto';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import { SongInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/song.response.dto';
import { TopPlaylistInfraestructureResponseDto } from '../../../common/infraestructure/dto/responses/top-playlist.response.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('AzureBufferImageHelper')
    private readonly azureBufferImageHelper: IGetBufferImageInterface,

    @Inject('GetPlaylistByIdService')
    private readonly GetPlaylistByIdService: IApplicationService<
      GetPlaylistByIdEntryApplicationDto,
      GetPlaylistByIdResponseApplicationDto
    >,
    @Inject('GetTopPlaylistService')
    private readonly GetTopPlaylistService: IApplicationService<
      TopPlaylistEntryApplicationDto,
      GetTopPlaylistResponseApplicationDto
    >,
  ) {}

  @Get('top_playlist')
  @Auth()
  async getTopPlaylist(@GetUser('id') userId: UserId) {
      const dto: TopPlaylistEntryApplicationDto = {
          userId: userId.Id,
    };
    const serviceResult: Result<GetTopPlaylistResponseApplicationDto> =
      await this.GetTopPlaylistService.execute(dto);
        if (!serviceResult.IsSuccess) {
          HttpResponseHandler.HandleException(
            serviceResult.statusCode,
            serviceResult.message,
            serviceResult.error,
            );
      }

      const playlists = [];

      for (const playlist of serviceResult.Data.playlists) {
          const playlistImage = await this.azureBufferImageHelper.getFile(
              playlist.Cover.Path,
          );
          const returnPlaylist= {
              id: playlist.Id.Id,
              image: playlistImage.IsSuccess ? playlistImage.Data : null,
          };
          playlists.push(returnPlaylist);
      }
      const response: TopPlaylistInfraestructureResponseDto = {
          playlists: playlists
      };

    return HttpResponseHandler.Success(200, response);
  }

  @Get(':id')
  @Auth()
  async getPlaylist(@Param('id') id: string, @GetUser('id') userId: UserId) {
    const dto: GetPlaylistByIdEntryApplicationDto = {
      userId: userId.Id,
      playlistId: id,
    };

    const serviceResult: Result<GetPlaylistByIdResponseApplicationDto> =
      await this.GetPlaylistByIdService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const playlistImage = await this.azureBufferImageHelper.getFile(
      serviceResult.Data.playlist.Cover.Path,
    );

    //TODO: Ver si lo enviamos para el coño o que si falla la imagen

    let duration: number = 0;
    let songs: SongInfraestructureResponseDto[] = [];

    for (const song of serviceResult.Data.songs) {
      duration += song.song.Duration.Duration;
      const songImage = await this.azureBufferImageHelper.getFile(
        song.song.Cover.Path,
      );
      const artists = song.artists.map((artist) => {
        return {
          id: artist.Id.Id,
          name: artist.Name.Name,
        };
      });
      const returnSong: SongInfraestructureResponseDto = {
        id: song.song.Id.Id,
        name: song.song.Name.Name,
        duration: timeConverter(song.song.Duration.Duration),
        image: songImage.IsSuccess ? songImage.Data : null,
        artists: artists,
      };
      songs.push(returnSong);
    }

    const response: PlaylistInfraestructureResponseDto = {
      id: serviceResult.Data.playlist.Id.Id,
      name: serviceResult.Data.playlist.Name.Name,
      duration: timeConverter(duration),
      image: playlistImage.IsSuccess ? playlistImage.Data : null,
      songs: songs,
    };

    return HttpResponseHandler.Success(200, response);
  }
}
