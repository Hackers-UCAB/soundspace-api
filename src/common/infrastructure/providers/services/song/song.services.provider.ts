import { Provider } from "@nestjs/common";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { GetTopSongsService } from "src/song/application/services/get-top-songs.application.service";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";


export const songServicesProviders: Provider[] = [
    {
        provide: 'GetTopSongsService',
        useFactory: (artistRepository: IArtistRepository, songRepository: ISongRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTopSongsService(
               songRepository,
                artistRepository
              ),
              auditingRepository,
              'GetTopSongsService',
              logger,
            ),
            logger,
            'GetTopSongsService',
          );
        },
        inject: ['ArtistRepository', 'SongRepository', 'AuditingRepository', 'ILogger'],
      },
]