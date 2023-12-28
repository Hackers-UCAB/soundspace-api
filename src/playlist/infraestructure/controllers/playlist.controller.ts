import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetPlaylistByIdResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';

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
    async getPlaylists() {

        return "alo";
    }

    @Get(':id')
    async getPlaylist(@Param('id') id: string) {

        const dto: GetPlaylistByIdEntryApplicationDto = {
            PlaylistId: id
        }
        const response = await this.GetPlaylistByIdService.execute(dto);
        return response.Data;
    }
}
