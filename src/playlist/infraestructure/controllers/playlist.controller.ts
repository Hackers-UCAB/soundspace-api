import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetPlaylistByIdResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';
import { AuthHeaderInfraestructureDto } from '../../../auth/infraestructure/dto/entrys/auth-header.infraestructure.dto';
import { UserId } from '../../../user/domain/value-objects/user-id';
import { GetUser } from '../../../auth/infraestructure/jwt/decorators/get-user.decorator';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';

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
    ) {}
    
    @Get()
    @Auth()
    async getPlaylists() {

        return "alo";
    }

    @Get(':id')
    async getPlaylist(@Param('id') id: string, @GetUser('id') userId: UserId) {
        const dto: GetPlaylistByIdEntryApplicationDto = {
            userId: userId.Id,
            PlaylistId: id
        }
        const response = await this.GetPlaylistByIdService.execute(dto);
        return response.Data;
    }
}
