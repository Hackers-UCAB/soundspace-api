import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { PlaylistResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';
import { GetPlaylistByIdService } from '../../application/services/get-playlist-by-id.application.service';
import { PlaylistRepository } from '../repositories/playlist.repository';
import { EmptyDto } from '../../../common/application/dto/empty.dto';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entrys/get-playlist-by-id-entry.application.dto';

@Controller('playlist')
export class playlistController {
    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,
        
        @Inject('GetPlaylistByIdService')
        private readonly GetPlaylistByIdService: IApplicationService<
            GetPlaylistByIdEntryApplicationDto,
            PlaylistResponseApplicationDto
        >,
    ) {}
    
    @Get()
    async getPlaylists() {

        return "alo";
    }

    @Get(':id')
    async getPlaylist(@Param('id') id: GetPlaylistByIdEntryApplicationDto) {
        const response = await this.GetPlaylistByIdService.execute(id);
        return response.Data;
    }
}
