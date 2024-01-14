import { Controller, Inject, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetAlbumByIdResponseApplicationDto } from '../../application/dto/responses/get-album-by-id-response.application.dto';
import { GetAlbumByIdEntryApplicationDto } from '../../application/dto/entries/get-album-by-id-entry.application.dto';
import { GetTopAlbumResponseApplicationDto } from '../../application/dto/responses/get-top-album-response.application.dto';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { GetUser } from '../../../auth/infraestructure/jwt/decorators/get-user.decorator';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/domain/result-handler/result';
import { GetTopAlbumResponseInfrastructureDto } from '../dto/responses/get-top-album-response.infraestructure.dto';
import { GetAlbumByIdResponseInfrastructureDto } from '../dto/responses/get-album-by-id-response.infrastructure.dto';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { SongInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/song.response.dto';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import { PlaylistInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/playlist.response.dto';
import { TopPlaylistInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/top-playlist.response.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

@Controller('album')
export class AlbumController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('AzureBufferImageHelper')
    private readonly azureBufferImageHelper: IGetBufferImageInterface,

    @Inject('GetAlbumByIdService')
    private readonly getAlbumByIdService: IApplicationService<
      GetAlbumByIdEntryApplicationDto,
      GetAlbumByIdResponseApplicationDto
    >,

    @Inject('GetTopAlbumService')
    private readonly GetTopAlbumService: IApplicationService<
      ServiceEntry,
      GetTopAlbumResponseApplicationDto
    >,
  ) {}

  @Get('top_albums')
  @Auth()
  async getTopAlbum(@GetUser('id') userId: UserId) {
    const dto: ServiceEntry = {
      userId: userId.Id,
    };
    const serviceResult: Result<GetTopAlbumResponseApplicationDto> =
      await this.GetTopAlbumService.execute(dto);
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.statusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const albums = [];

    for (const album of serviceResult.Data.albums) {
      const albumImage = await this.azureBufferImageHelper.getFile(
        album.Cover.Path,
      );
      const returnAlbum = {
        id: album.Id.Id,
        image: albumImage.IsSuccess ? albumImage.Data : null,
      };
      albums.push(returnAlbum);
    }

    const response: TopPlaylistInfraestructureResponseDto = {
      playlists: albums,
    };

    return HttpResponseHandler.Success(200, response);
  }

  @Get(':id')
  @Auth()
  async getPlaylist(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: UserId) {
    const dto: GetAlbumByIdEntryApplicationDto = {
      userId: userId.Id,
      albumId: id,
    };

    const serviceResult: Result<GetAlbumByIdResponseApplicationDto> =
      await this.getAlbumByIdService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const albumImage = await this.azureBufferImageHelper.getFile(
      serviceResult.Data.album.Cover.Path,
    );

    let duration: number = 0;
    let songs: SongInfraestructureResponseDto[] = [];
    const creators = serviceResult.Data.creators.map((artist) => {
      return {
        creatorId: artist.Id.Id,
        creatorName: artist.Name.Name,
      };
    });

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
      id: serviceResult.Data.album.Id.Id,
      name: serviceResult.Data.album.Name.Name,
      duration: timeConverter(duration),
      image: albumImage.IsSuccess ? albumImage.Data : null,
      creators: creators,
      songs: songs,
    };

    return HttpResponseHandler.Success(200, response);
  }
}
