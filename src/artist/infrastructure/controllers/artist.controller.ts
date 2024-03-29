import { Controller, Inject, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from '../../../common/infrastructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/domain/result-handler/result';
import { GetArtistByIdEntryApplicationDto } from 'src/artist/application/dto/entry/get-artist-by-id-entry.application.dto';
import { GetArtistByIdResponseApplicationDto } from 'src/artist/application/dto/response/get-artist-by-id-response.application.dto';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { GetTrendingArtistsResponseApplicationDto } from 'src/artist/application/dto/response/get-trending-artists-response.application.dto';
import {
  TrendingArtistsInfrastructureResponseDto,
  TrendingArtistsSwaggerInfrastructureResponseDto,
} from '../dto/response/trending-artists-response.infrastructure.dto';
import { SongInfrastructureResponseDto } from 'src/common/infrastructure/dto/response/song/song.response.dto';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import {
  ArtistByIdInfrastructureResponseDto,
  ArtistByIdSwaggerInfrastructureResponseDto,
} from '../dto/response/artist-by-id-response.infrastructure.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('artist')
@ApiBearerAuth('token')
@ApiUnauthorizedResponse({ description: 'No se encontro el token' })
@Controller('artist')
export class ArtistController {
  constructor(
    @Inject('AzureBufferImageHelper')
    private readonly azureBufferImageHelper: IGetBufferImageInterface,

    @Inject('GetArtistByIdService')
    private readonly getArtistByIdService: IApplicationService<
      GetArtistByIdEntryApplicationDto,
      GetArtistByIdResponseApplicationDto
    >,

    @Inject('GetTrendingArtistsService')
    private readonly getTrendingArtistsService: IApplicationService<
      ServiceEntry,
      GetTrendingArtistsResponseApplicationDto
    >,
  ) {}

  @Get('top_artists')
  @ApiCreatedResponse({
    description: 'Se consulto correctamente la lista de trending artists',
    type: TrendingArtistsSwaggerInfrastructureResponseDto,
  })
  @Get('top_artists')
  @Auth()
  async getTrendingArtists(@GetUser('id') userId: UserId) {
    const dto: ServiceEntry = {
      userId: userId.Id,
    };

    const serviceResult: Result<GetTrendingArtistsResponseApplicationDto> =
      await this.getTrendingArtistsService.execute(dto);
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.statusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const artists = [];

    for (const artist of serviceResult.Data.artists) {
      const artistImage = await this.azureBufferImageHelper.getFile(
        artist.Photo.Path,
      );

      const returnArtists = {
        id: artist.Id.Id,
        name: artist.Name.Name,
        image: artistImage.IsSuccess ? artistImage.Data : null,
      };

      artists.push(returnArtists);
    }
    const response: TrendingArtistsInfrastructureResponseDto = {
      artists: artists,
    };

    return HttpResponseHandler.Success(200, response);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'El identificador único de un artista',
    example: 'c77bd9ae-08a9-4f94-bc86-4afffd0fee3f',
  })
  @ApiCreatedResponse({
    description:
      'Se consulto correctamente la informacion de un artista por su id',
    type: ArtistByIdSwaggerInfrastructureResponseDto,
  })
  @Get(':id')
  @Auth()
  async getArtist(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser('id') userId: UserId,
  ) {
    const dto: GetArtistByIdEntryApplicationDto = {
      userId: userId.Id,
      artistId: id,
    };

    const serviceResult: Result<GetArtistByIdResponseApplicationDto> =
      await this.getArtistByIdService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const artistImage = await this.azureBufferImageHelper.getFile(
      serviceResult.Data.artist.Photo.Path,
    );

    let albums: { id: string; image: Buffer }[] = [];

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

    let duration: number = 0;
    let songs: SongInfrastructureResponseDto[] = [];

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

    const response: ArtistByIdInfrastructureResponseDto = {
      id: serviceResult.Data.artist.Id.Id,
      name: serviceResult.Data.artist.Name.Name,
      genre: serviceResult.Data.artist.Genre.Genre,
      image: artistImage.IsSuccess ? artistImage.Data : null,
      albums: albums,
      songs: songs,
    };

    return HttpResponseHandler.Success(200, response);
  }
}
