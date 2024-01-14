import { Provider } from "@nestjs/common";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { GetPlaylistByIdService } from "src/playlist/application/services/get-playlist-by-id.application.service";
import { GetTopPlaylistService } from "src/playlist/application/services/get-top-playlist.application.service";
import { PlaylistRepository } from "src/playlist/infrastructure/repositories/playlist.repository";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const playlistServicesProviders: Provider[] = [
    {
        provide: 'GetPlaylistByIdService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetPlaylistByIdService(
                new PlaylistRepository(dataSource),
                new SongRepository(dataSource, new OrmSongMapper()),
                new ArtistRepository(dataSource),
              ),
              new AuditingRepository(dataSource),
              'GetPlaylistByIdService',
              logger,
            ),
            logger,
            'GetPlaylistByIdService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
      {
        provide: 'GetTopPlaylistService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTopPlaylistService(new PlaylistRepository(dataSource)),
              new AuditingRepository(dataSource),
              'GetTopPlaylistService',
              logger,
            ),
            logger,
            'GetTopPlaylistService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]