import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';

import { DataSource } from 'typeorm';
import axios from 'axios';
import { AzureBlobHelper } from '../helpers/get-blob-file.helper';
import { Readable } from 'stream';
import { GetTopSongsResponseApplicationDto } from '../../application/dto/responses/get-top-songs.response.application.dto';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { Result } from '../../../common/application/result-handler/result';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { IGetBufferImageInterface } from '../../../common/domain/interfaces/get-buffer-image.interface';
import { SongInfraestructureResponseDto, SongSwaggerInfraestructureResponseDto } from '../../../common/infraestructure/dto/responses/song.response.dto';
import { timeConverter } from '../../../common/domain/helpers/convert-duration';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { ServiceEntry } from '../../../common/application/services/dto/entry/service-entry.dto';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('song')
@Controller('song')
export class SongController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('AzureBufferImageHelper')
        private readonly azureBufferImageHelper: IGetBufferImageInterface,

        @Inject('GetTopSongsService')
        private readonly GetTopPlaylistService: IApplicationService<
            ServiceEntry,
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

    @Get('top_song')
    @ApiCreatedResponse({ description: 'Se consulto correctamente la lista de Top songs', type: SongSwaggerInfraestructureResponseDto })
    @Auth()
    async getTopPlaylist(@GetUser('id') userId: UserId) {
        const serviceResult: Result<GetTopSongsResponseApplicationDto> =
            await this.GetTopPlaylistService.execute({ userId: userId.Id });
        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.statusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }
        let songs: SongInfraestructureResponseDto[] = [];

        for (const song of serviceResult.Data.songs) {
            const songImage = await this.azureBufferImageHelper.getFile(
                song.song.Cover.Path,
            );
            const artists = song.artists.map((artist) => {
                return {
                    id: artist.Id.Id,
                    name: artist.Name.Name,
                };
            });
            const returnSong: SongInfraestructureResponseDto = {
                id: song.song.Id.Id,
                name: song.song.Name.Name,
                duration: timeConverter(song.song.Duration.Duration),
                image: songImage.IsSuccess ? songImage.Data : null,
                artists: artists,
            };
            songs.push(returnSong);
        }
        return HttpResponseHandler.Success(200, songs);
    }
}
