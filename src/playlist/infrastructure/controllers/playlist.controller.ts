import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';
import { GetPlaylistByIdResponseApplicationDto } from '../../application/dto/responses/get-playlist-by-id-response.application.dto';
import { GetTopPlaylistResponseApplicationDto } from '../../application/dto/responses/get-top-playlist-response.application.dto';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/application/result-handler/result';
import { GetTopPlaylistResponseInfrastructureDto } from '../dto/responses/get-top-playlist-response.infrastructure.dto';
import { TopPlaylistEntryApplicationDto } from '../../application/dto/entrys/get-top-playlist-entry.application.dto';
import { GetPlaylistByIdEntryInfrastructureDto } from '../dto/entrys/get-playlist-by-id-entry.infrastrucrure.dto';
import { GetPlaylistByIdResponseInfrastructureDto } from '../dto/responses/get-playlist-by-id-response.infrastructure.dto';

@Controller('playlist')
export class playlistController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

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

  @Get('TopPlaylist')
  async getTopPlaylist() {
    const dto: TopPlaylistEntryApplicationDto = {
      userId: '63fb22cb-e53f-4504-bdba-1b75a1209539',
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
    const response: GetTopPlaylistResponseInfrastructureDto = {
      playlists: serviceResult.Data.playlists,
    };
    return HttpResponseHandler.Success(200, response);
  }

  @Get(':id')
  async getPlaylist(@Param('id') id: string) {
    const dto: GetPlaylistByIdEntryApplicationDto = {
      userId: '63fb22cb-e53f-4504-bdba-1b75a1209539',
      PlaylistId: id,
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
    const response: GetPlaylistByIdResponseInfrastructureDto = {
      id: serviceResult.Data.id,
      name: serviceResult.Data.name,
      duration: serviceResult.Data.duration,
      image: serviceResult.Data.im,
      songs: serviceResult.Data.songs,
    };

    return HttpResponseHandler.Success(200, response);
  }
}
