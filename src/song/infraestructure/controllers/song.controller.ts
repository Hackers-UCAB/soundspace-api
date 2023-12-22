import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';
import { DataSource } from 'typeorm';



@Controller('song')
export class SongController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,
    ){

    }
    // @Get(':id')
    // async getSong(@Param('id') id: string, @Res({passthrough: true}) res: Response) {
        
    // }
}
