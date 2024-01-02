import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';

import { DataSource } from 'typeorm';
import axios from 'axios';
import { AzureBlobHelper } from '../helpers/get-blob-file.helper';
import { Readable } from 'stream';
import { GetTopSongsEntryApplicationDto } from '../../application/dto/entrys/get-top-songs.entry.application.dto';
import { GetTopSongsResponseApplicationDto } from '../../application/dto/responses/get-top-songs.response.application.dto';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { Result } from '../../../common/application/result-handler/result';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { GetTopSongsResponseInfrastructureDto } from '../dto/responses/get-top-songs-response.infrastructure.dto';



@Controller('song')
export class SongController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('GetTopSongsService')
        private readonly GetTopPlaylistService: IApplicationService<
            GetTopSongsEntryApplicationDto,
            GetTopSongsResponseApplicationDto
        >,
    ){ }
    
  //   @Get()
  // async getFile(@Res({passthrough: true}) res: Response) {

  //   // const {data} = await axios.get('https://songsv1.blob.core.windows.net/foto/arianagrande_myeverything.jpg?sp=r&st=2023-12-28T02:04:58Z&se=2023-12-28T10:04:58Z&sv=2022-11-02&sr=b&sig=QUBqAECBBVxR7D4F60BiZqwjM9IlCTDmWU9LTHqKdoc%3D',{
  //   //     responseType: 'stream'
  //   // })
  //   const helper = new AzureBlobHelper();
  //   const client = await helper.getBlobClient('arianagrande_myeverything.jpg', 'foto')
  //   const stream = await client.download();
  //   const streamable = new Readable(client)
  //   return new StreamableFile(streamable);
  // }

    @Get('TopSongs')
    async getTopPlaylist() {
        const dto: GetTopSongsEntryApplicationDto = {
            userId: '63fb22cb-e53f-4504-bdba-1b75a1209539',
        }
        const serviceResult: Result<GetTopSongsResponseApplicationDto> =
            await this.GetTopPlaylistService.execute(dto);
        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.statusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }
        const response: GetTopSongsResponseInfrastructureDto = {
            songs: serviceResult.Data.songs
        }
        return HttpResponseHandler.Success(200, response);
    }
}
