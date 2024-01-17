import { Controller, Get, Inject, Param, Res, Headers, StreamableFile, Body } from '@nestjs/common';


import { GetTopSongsResponseApplicationDto } from '../../application/dto/response/get-top-songs.response.application.dto';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { Result } from '../../../common/domain/result-handler/result';
import { HttpResponseHandler } from '../../../common/infrastructure/http-response-handler/http-response.handler';
import { IGetBufferImageInterface } from '../../../common/domain/interfaces/get-buffer-image.interface';
import { SongInfrastructureResponseDto } from '../../../common/infrastructure/dto/response/song/song.response.dto';
import { timeConverter } from '../../../common/domain/helpers/convert-duration';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { ServiceEntry } from '../../../common/application/services/dto/entry/service-entry.dto';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';


@Controller('song')
export class SongController {

    constructor(
        @Inject('AzureBufferImageHelper')
        private readonly azureBufferImageHelper: IGetBufferImageInterface,

        @Inject('GetTopSongsService')
        private readonly GetTopPlaylistService: IApplicationService<
            ServiceEntry,
            GetTopSongsResponseApplicationDto
        >,
    ){ }

    @Get('top_songs')
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
        let songs: SongInfrastructureResponseDto[] = [];

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
            const returnSong: SongInfrastructureResponseDto = {
                id: song.song.Id.Id,
                name: song.song.Name.Name,
                duration: timeConverter(song.song.Duration.Duration),
                image: songImage.IsSuccess ? songImage.Data : null,
                artists: artists,
            };
            songs.push(returnSong);
        }
        return HttpResponseHandler.Success(200, {songs});
    }
}
