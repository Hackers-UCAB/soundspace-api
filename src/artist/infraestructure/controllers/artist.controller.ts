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
import { GetTrendingArtistsResponseApplicationDto } from 'src/artist/application/dto/response/get-trending-artists-response.application.dto';
import { TrendingArtistsInfraestructureResponseDto } from '../dto/response/trending-artists-response.infraestructure.dto';
import { SongInfraestructureResponseDto } from 'src/common/infraestructure/dto/responses/song.response.dto';
import { timeConverter } from 'src/common/domain/helpers/convert-duration';
import { ArtistByIdInfraestructureResponseDto } from '../dto/response/artist-by-id-response.infraestructure.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

@Controller('artist')
export class ArtistController {

    constructor(
        @Inject('DataSource')
        private readonly dataSource: DataSource,

        @Inject('AzureBufferImageHelper')
        private readonly azureBufferImageHelper: IGetBufferImageInterface,

        @Inject('GetArtistByIdService')
        private readonly getArtistByIdService: IApplicationService<
            GetArtistByIdEntryApplicationDto,
            GetArtistByIdResponseApplicationDto
        >,

        @Inject('GetTrendingArtistsService')
        private readonly getTrendingArtistsService: IApplicationService<
            ServiceEntry,
            GetTrendingArtistsResponseApplicationDto
        >,
    ) { }

    @Get(':id')
    @Auth()
    async getArtist(@Param('id') id: string, @GetUser('id') userId: UserId) {
        const dto: GetArtistByIdEntryApplicationDto = {
            userId: userId.Id,
            artistId: id,
        };

        const serviceResult: Result<GetArtistByIdResponseApplicationDto> =
            await this.getArtistByIdService.execute(dto);

        if (!serviceResult.IsSuccess) {
            HttpResponseHandler.HandleException(
                serviceResult.StatusCode,
                serviceResult.message,
                serviceResult.error,
            );
        }

        const artistImage = await this.azureBufferImageHelper.getFile(
            serviceResult.Data.artist.Photo.Path,
        );

        let albums: {id: string, image: Buffer}[] = [];

        for (const album of serviceResult.Data.albums) {
            const albumImage = await this.azureBufferImageHelper.getFile(
                album.Cover.Path,
            );

            const returnAlbum = {
                id: album.Id.Id,
                image: albumImage.IsSuccess ? albumImage.Data : null,
            };

            albums.push(returnAlbum);
        }

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

        const response: ArtistByIdInfraestructureResponseDto = {
            id: serviceResult.Data.artist.Id.Id,
            name: serviceResult.Data.artist.Name.Name,
            image: artistImage.IsSuccess ? artistImage.Data : null,
            albums: albums,
            songs: songs,
        };

        console.log(response);

        return HttpResponseHandler.Success(200, response);
    }

    @Get('trending_artists')
    @Auth()
    async getTrendingArtists(@GetUser('id') userId: UserId) {

        const dto: ServiceEntry = {
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

        const artists = [];

        for (const artist of serviceResult.Data.artists) {

            const artistImage = await this.azureBufferImageHelper.getFile(
                artist.Photo.Path,
            );

            const returnArtists = {
                id: artist.Id.Id,
                name: artist.Name.Name,
                image: artistImage.IsSuccess ? artistImage.Data : null,
            };

            artists.push(returnArtists);
        }
        const response: TrendingArtistsInfraestructureResponseDto = {
            artists: artists
        };

        return HttpResponseHandler.Success(200, response);
    }

}