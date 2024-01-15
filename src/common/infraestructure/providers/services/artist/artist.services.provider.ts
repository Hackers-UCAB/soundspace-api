import { Provider } from "@nestjs/common";
import { IAlbumRepository } from "src/album/domain/repositories/album.repository.interface";
import { AlbumRepository } from "src/album/infraestructure/repositories/album.repository";
import { GetArtistByIdService } from "src/artist/application/services/get-artist-by-id.application.service";
import { GetTrendingArtistsService } from "src/artist/application/services/get-trending-artists.application.service";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/auditing/repositories/auditing.repository";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const artistServicesProviders: Provider[] = [
    {
        provide: 'GetArtistByIdService',
        useFactory: (artistRepository: IArtistRepository, albumRepository: IAlbumRepository, songRepository: ISongRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetArtistByIdService(
                artistRepository,
                songRepository,
                albumRepository,
              ),
              auditingRepository,
              'GetArtistByIdService',
              logger,
            ),
            logger,
            'GetArtistByIdService',
          );
        },
        inject: ['ArtistRepository', 'AlbumRepository', 'SongRepository', 'AuditingRepository', 'ILogger'],
      },
      {
        provide: 'GetTrendingArtistsService',
        useFactory: (artistRepository: IArtistRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTrendingArtistsService(
                artistRepository,
              ),
              auditingRepository,
              'GetTrendingArtistsService',
              logger,
            ),
            logger,
            'GetTrendingArtistsService',
          );
        },
        inject: ['ArtistRepository', 'AuditingRepository', 'ILogger'],
      },
]