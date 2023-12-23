import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { PlaylistIdEntryApplicationDto } from '../../application/dto/entrys/playlist-id-entry.application.dto';
import { PlaylistResponseApplicationDto } from '../../application/dto/responses/playlist-response.application.dto';
import { GetPlaylistByIdService } from '../../application/services/get-playlist-by-id.application.service';
import { PlaylistRepository } from '../repositories/playlist.repository';

@Controller('playlist')
export class AuthController {
    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('PlaylistByIdService')
        private readonly GetPlaylistByIdService: IApplicationService<
            string,
            PlaylistResponseApplicationDto
        >,
    ) {}
    /*
    @Get()
    async getPlaylists() {
        const service = new GetPlaylistByIdService(new PlaylistRepository(this.dataSource));
        const response = await service.execute()

        return response.Data
    }
    */

    @Get(':id')
    async getPlaylist(@Param('id') id: string) {
        
        const response = await this.GetPlaylistByIdService.execute(id);
        return response.Data;
    }
}
