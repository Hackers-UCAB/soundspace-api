import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';
import { FindSongUrlService } from 'src/song/application/services/find-song-url.application.service';
import { DataSource } from 'typeorm';
import { Response} from 'express';
import { SongRepository } from '../repositories/song.repository';
import { AxiosAdapter } from '../adapter/http-request.adapter';


@Controller('song')
export class SongController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,
    ){

    }
    @Get(':id')
    async getSong(@Param('id') id: string, @Res({passthrough: true}) res: Response) {
        const service = new FindSongUrlService(new SongRepository(this.dataSource), new AxiosAdapter);
        const response = await service.execute(id)

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `attachment; filename= ${id}.mp3`,
        })

        return response.Data
    }
}
