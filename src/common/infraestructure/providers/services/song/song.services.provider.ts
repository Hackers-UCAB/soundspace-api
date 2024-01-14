import { Provider } from "@nestjs/common";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AzureBufferImageHelper } from "src/common/infraestructure/azure/helpers/get-blob-image.helper";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { GetTopSongsService } from "src/song/application/services/get-top-songs.application.service";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const songServicesProviders: Provider[] = [
    {
        provide: 'GetTopSongsService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTopSongsService(
                new SongRepository(dataSource, new OrmSongMapper()),
                new ArtistRepository(dataSource),
                new AzureBufferImageHelper(),
              ),
              new AuditingRepository(dataSource),
              'GetTopSongsService',
              logger,
            ),
            logger,
            'GetTopSongsService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]