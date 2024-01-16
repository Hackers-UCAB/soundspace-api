import { Controller, Inject, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetAlbumByIdResponseApplicationDto } from '../../application/dto/response/get-album-by-id-response.application.dto';
import { GetAlbumByIdEntryApplicationDto } from '../../application/dto/entry/get-album-by-id-entry.application.dto';
import { GetTopAlbumResponseApplicationDto } from '../../application/dto/response/get-top-album-response.application.dto';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { GetUser } from '../../../auth/infrastructure/jwt/decorators/get-user.decorator';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { HttpResponseHandler } from 'src/common/infrastructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/domain/result-handler/result';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { SongInfrastructureResponseDto } from 'src/common/infrastructure/dto/response/song/song.response.dto';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import {
  PlaylistInfrastructureResponseDto,
  PlaylistSwaggerInfrastructureResponseDto,
} from 'src/common/infrastructure/dto/response/playlist/playlist.response.dto';
import {
  TopPlaylistInfrastructureResponseDto,
  TopPlaylistSwaggerInfrastructureResponseDto,
} from '../../../common/infrastructure/dto/response/playlist/top-playlist.response.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('album')
@ApiBearerAuth('token')
@ApiUnauthorizedResponse({ description: 'No se encontro el token' })
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
  @ApiCreatedResponse({
    description: 'Se consulto correctamente la lista de albums trending',
    type: TopPlaylistSwaggerInfrastructureResponseDto,
  })
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

    const response: TopPlaylistInfrastructureResponseDto = {
      playlists: albums,
    };

    return HttpResponseHandler.Success(200, response);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'El identificador único del album',
    example: '7abca2dc-7f77-4023-b5cd-13e44d3bf192',
  })
  @ApiCreatedResponse({
    description: 'Se consultó correctamente al album mediante su uuid',
    type: PlaylistSwaggerInfrastructureResponseDto,
  })
  @Auth()
  async getPlaylist(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: UserId,
  ) {
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
    let songs: SongInfrastructureResponseDto[] = [];
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
      const returnSong: SongInfrastructureResponseDto = {
        id: song.song.Id.Id,
        name: song.song.Name.Name,
        duration: timeConverter(song.song.Duration.Duration),
        image: songImage.IsSuccess ? songImage.Data : null,
        artists: artists,
      };
      songs.push(returnSong);
    }

    const response: PlaylistInfrastructureResponseDto = {
      id: serviceResult.Data.album.Id.Id,
      name: serviceResult.Data.album.Name.Name,
      duration: timeConverter(duration),
      image: albumImage.IsSuccess ? albumImage.Data : null,
      creators: creators,
      songs: songs,
    };

    console.log('resultado del controller: ', response);
    return HttpResponseHandler.Success(200, response);
  }
}
