import { Provider } from "@nestjs/common";
import { AlbumRepository } from "src/album/infraestructure/repositories/album.repository";
import { GetArtistByIdService } from "src/artist/application/services/get-artist-by-id.application.service";
import { GetTrendingArtistsService } from "src/artist/application/services/get-trending-artists.application.service";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const artistServicesProviders: Provider[] = [
    {
        provide: 'GetArtistByIdService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetArtistByIdService(
                new ArtistRepository(dataSource),
                new SongRepository(dataSource, new OrmSongMapper()),
                new AlbumRepository(dataSource),
              ),
              new AuditingRepository(dataSource),
              'GetArtistByIdService',
              logger,
            ),
            logger,
            'GetArtistByIdService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
      {
        provide: 'GetTrendingArtistsService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTrendingArtistsService(
                new ArtistRepository(dataSource),
              ),
              new AuditingRepository(dataSource),
              'GetTrendingArtistsService',
              logger,
            ),
            logger,
            'GetTrendingArtistsService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]