import { Controller, Inject, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { GetPlaylistByIdEntryApplicationDto } from '../../application/dto/entry/get-playlist-by-id-entry.application.dto';
import { GetPlaylistByIdResponseApplicationDto } from '../../application/dto/response/get-playlist-by-id-response.application.dto';
import { GetTopPlaylistResponseApplicationDto } from '../../application/dto/response/get-top-playlist-response.application.dto';
import { HttpResponseHandler } from '../../../common/infrastructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/domain/result-handler/result';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { PlaylistInfrastructureResponseDto, PlaylistSwaggerInfrastructureResponseDto } from 'src/common/infrastructure/dto/response/playlist/playlist.response.dto';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import { SongInfrastructureResponseDto } from 'src/common/infrastructure/dto/response/song/song.response.dto';
import { TopPlaylistInfrastructureResponseDto, TopPlaylistSwaggerInfrastructureResponseDto } from '../../../common/infrastructure/dto/response/playlist/top-playlist.response.dto';
import { ServiceEntry } from '../../../common/application/services/dto/entry/service-entry.dto';
import { ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('playlist')
@Controller('playlist')
export class PlaylistController {
    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('AzureBufferImageHelper')
        private readonly azureBufferImageHelper: IGetBufferImageInterface,

        @Inject('GetPlaylistByIdService')
        private readonly GetPlaylistByIdService: IApplicationService<
            GetPlaylistByIdEntryApplicationDto,
            GetPlaylistByIdResponseApplicationDto
        >,
        @Inject('GetTopPlaylistService')
        private readonly GetTopPlaylistService: IApplicationService<
            ServiceEntry,
            GetTopPlaylistResponseApplicationDto
        >,
    ) { }

    @Get('top_playlists')
    @ApiCreatedResponse({ description: 'Se consulto correctamente la lista de Top playlists', type: TopPlaylistSwaggerInfrastructureResponseDto })
    @Auth()
    async getTopPlaylist(@GetUser('id') userId: UserId) {
        const serviceResult: Result<GetTopPlaylistResponseApplicationDto> =
            await this.GetTopPlaylistService.execute({ userId: userId.Id });
        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.statusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }

        const playlists = [];

        for (const playlist of serviceResult.Data.playlists) {
            const playlistImage = await this.azureBufferImageHelper.getFile(
                playlist.Cover.Path,
            );
            const returnPlaylist = {
                id: playlist.Id.Id,
                image: playlistImage.IsSuccess ? playlistImage.Data : null,
            };
            playlists.push(returnPlaylist);
        }
        const response: TopPlaylistInfrastructureResponseDto = {
            playlists: playlists,
        };

        return HttpResponseHandler.Success(200, response);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'El identificador único de la playlist', example: 'c77bd9ae-08a9-4f94-bc86-4afffd0fee3f' })
    @ApiCreatedResponse({ description: 'Se consulto correctamente la playlist mediante su uuid', type: PlaylistSwaggerInfrastructureResponseDto })
    @Auth()
    async getPlaylist(
        @Param('id', ParseUUIDPipe) id: string,
        @GetUser('id') userId: UserId,
    ) {
        const dto: GetPlaylistByIdEntryApplicationDto = {
            userId: userId.Id,
            playlistId: id,
        };

        const serviceResult: Result<GetPlaylistByIdResponseApplicationDto> =
            await this.GetPlaylistByIdService.execute(dto);

        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.StatusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }

        const playlistImage = await this.azureBufferImageHelper.getFile(
            serviceResult.Data.playlist.Cover.Path,
        );

        //TODO: Ver si lo enviamos para el coño o que si falla la imagen

        let duration: number = 0;
        let songs: SongInfrastructureResponseDto[] = [];

        for (const song of serviceResult.Data.songs) {
            duration += song.song.Duration.Duration;
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

        const response: PlaylistInfrastructureResponseDto = {
            id: serviceResult.Data.playlist.Id.Id,
            name: serviceResult.Data.playlist.Name.Name,
            duration: timeConverter(duration),
            image: playlistImage.IsSuccess ? playlistImage.Data : null,
            songs: songs,
        };

        return HttpResponseHandler.Success(200, response);
    }
}