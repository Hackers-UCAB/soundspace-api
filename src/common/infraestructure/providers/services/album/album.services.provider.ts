import { Provider } from "@nestjs/common";
import { GetAlbumByIdService } from "src/album/application/services/get-album-by-id.application.service";
import { GetTopAlbumService } from "src/album/application/services/get-top-album.application.service";
import { AlbumRepository } from "src/album/infraestructure/repositories/album.repository";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const albumServicesProviders: Provider [] = [
    {
        provide: 'GetAlbumByIdService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetAlbumByIdService(
                new AlbumRepository(dataSource),
                new ArtistRepository(dataSource),
                new SongRepository(dataSource, new OrmSongMapper()),
              ),
    
              new AuditingRepository(dataSource),
              'GetAlbumByIdService',
              logger,
            ),
            logger,
            'GetAlbumByIdService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
      {
        provide: 'GetTopAlbumService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTopAlbumService(new AlbumRepository(dataSource)),
              new AuditingRepository(dataSource),
              'GetTopAlbumService',
              logger,
            ),
            logger,
            'GetTopAlbumService',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]