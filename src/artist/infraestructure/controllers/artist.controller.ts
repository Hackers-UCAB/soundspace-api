import { Controller, Inject, Get, Param } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from '../../../common/infraestructure/http-response-handler/http-response.handler';
import { Result } from '../../../common/application/result-handler/result';
import { GetArtistByIdEntryApplicationDto } from 'src/artist/application/dto/entry/get-artist-by-id-entry.application.dto';
import { GetArtistByIdResponseApplicationDto } from 'src/artist/application/dto/response/get-artist-by-id-response.application.dto';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { GetTopEntryApplicationDto } from 'src/common/application/top/dto/entry/get-top.entry.dto';
import { GetTrendingArtistsResponseApplicationDto } from 'src/artist/application/dto/response/get-trending-artists-response.application.dto';
import { TrendingArtistsInfraestructureResponseDto } from '../dto/response/trending-artists.infraestructure.dto';

@Controller('artist')
export class ArtistController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('AzureBufferImageHelper')
        private readonly azureBufferImageHelper: IGetBufferImageInterface,

        @Inject('GetArtistByIdService')
        private readonly getPlaylistByIdService: IApplicationService<
            GetArtistByIdEntryApplicationDto,
            GetArtistByIdResponseApplicationDto
        >,

        @Inject('GetTrendingArtistsService')
        private readonly getTrendingArtistsService: IApplicationService<
            GetTopEntryApplicationDto,
            GetTrendingArtistsResponseApplicationDto
        >,
    ) { }

    @Get('trending_artists')
    @Auth()
    async getTrendingArtists(@GetUser('id') userId: UserId) {

        const dto: GetTopEntryApplicationDto = {
            userId: userId.Id,
        };

        const serviceResult: Result<GetTrendingArtistsResponseApplicationDto> =
            await this.getTrendingArtistsService.execute(dto);
        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.statusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }

        console.log(serviceResult.Data);

        const artists = [];

        for (const artist of serviceResult.Data.artists) {

            const artistImage = await this.azureBufferImageHelper.getFile(
                artist.Photo.Path,
            );

            const returnArtists = {
                id: artist.Id.Id,
                image: artistImage.IsSuccess ? artistImage.Data : null,
            };

            artists.push(returnArtists);
        }
        const response: TrendingArtistsInfraestructureResponseDto = {
            artists: artists
        };

        return HttpResponseHandler.Success(200, response);
    }

    /*@Get(':id')
    @Auth()
    async getPlaylist(@Param('id') id: string, @GetUser('id') userId: UserId) {
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
        let songs: SongInfraestructureResponseDto[] = [];

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
            const returnSong: SongInfraestructureResponseDto = {
                id: song.song.Id.Id,
                name: song.song.Name.Name,
                duration: timeConverter(song.song.Duration.Duration),
                image: songImage.IsSuccess ? songImage.Data : null,
                artists: artists,
            };
            songs.push(returnSong);
        }

        const response: PlaylistInfraestructureResponseDto = {
            id: serviceResult.Data.playlist.Id.Id,
            name: serviceResult.Data.playlist.Name.Name,
            duration: timeConverter(duration),
            image: playlistImage.IsSuccess ? playlistImage.Data : null,
            songs: songs,
        };

        return HttpResponseHandler.Success(200, response);
    }*/
}