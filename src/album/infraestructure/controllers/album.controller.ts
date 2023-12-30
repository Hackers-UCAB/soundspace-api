import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetAlbumByIdResponseApplicationDto } from '../../application/dto/responses/get-album-by-id-response.application.dto';
import { GetAlbumByIdEntryApplicationDto } from '../../application/dto/entries/get-album-by-id-entry.application.dto';
import { GetTopAlbumResponseApplicationDto } from '../../application/dto/responses/get-top-album-response.application.dto';
import { TopAlbumEntryApplicationDto } from '../../application/dto/entries/get-top-album-entry.application.dto';
import { AuthHeaderInfraestructureDto } from '../../../auth/infraestructure/dto/entrys/auth-header.infraestructure.dto';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { GetUser } from '../../../auth/infraestructure/jwt/decorators/get-user.decorator';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/application/result-handler/result';
import { GetTopAlbumResponseInfrastructureDto } from '../dto/responses/get-top-album-response.infraestructure.dto';

@Controller('album')
export class AlbumController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('GetAlbumByIdService')
    private readonly GetAlbumByIdService: IApplicationService<
      GetAlbumByIdEntryApplicationDto,
      GetAlbumByIdResponseApplicationDto
    >,

    @Inject('GetTopAlbumService')
    private readonly GetTopAlbumService: IApplicationService<
      TopAlbumEntryApplicationDto,
      GetTopAlbumResponseApplicationDto
    >,
    ) { }

    @Get('TopAlbum')
    async getTopAlbum() {
        const dto: TopAlbumEntryApplicationDto = {
            userId: '63fb22cb-e53f-4504-bdba-1b75a1209539',
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
        const response: GetTopAlbumResponseInfrastructureDto = {
            albums: serviceResult.Data.albums,
        };
        return HttpResponseHandler.Success(200, response);
    }

  @Get(':id')
  async getPlaylist(@Param('id') id: string) {
    const dto: GetAlbumByIdEntryApplicationDto = {
        userId: '63fb22cb-e53f-4504-bdba-1b75a1209539',
      albumId: id,
    };
    const response = await this.GetAlbumByIdService.execute(dto);
    return response.Data;
  }

  
}
