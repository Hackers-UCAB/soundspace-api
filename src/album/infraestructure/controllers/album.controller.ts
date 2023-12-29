import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetAlbumByIdResponseApplicationDto } from '../../application/dto/responses/album-response.application.dto';
import { GetAlbumByIdEntryApplicationDto } from '../../application/dto/entries/get-album-by-id-entry.application.dto';
import { AuthHeaderInfraestructureDto } from '../../../auth/infraestructure/dto/entrys/auth-header.infraestructure.dto';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { GetUser } from '../../../auth/infraestructure/jwt/decorators/get-user.decorator';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';

@Controller('playlist')
export class playlistController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('GetAlbumByIdService')
    private readonly GetAlbumByIdService: IApplicationService<
      GetAlbumByIdEntryApplicationDto,
      GetAlbumByIdResponseApplicationDto
    >,
  ) {}

  @Get()
  @Auth()
  async getAlbums() {
    return 'alo';
  }

  @Get(':id')
  async getPlaylist(@Param('id') id: string, @GetUser('id') userId: UserId) {
    const dto: GetAlbumByIdEntryApplicationDto = {
      userId: userId.Id,
      albumId: id,
    };
    const response = await this.GetAlbumByIdService.execute(dto);
    return response.Data;
  }
}
