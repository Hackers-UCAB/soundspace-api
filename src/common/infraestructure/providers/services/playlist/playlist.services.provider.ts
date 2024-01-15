import { Provider } from "@nestjs/common";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/auditing/repositories/auditing.repository";
import { GetPlaylistByIdService } from "src/playlist/application/services/get-playlist-by-id.application.service";
import { GetTopPlaylistService } from "src/playlist/application/services/get-top-playlist.application.service";
import { IPlaylistRepository } from "src/playlist/domain/repositories/playlist.repository.interface";
import { PlaylistRepository } from "src/playlist/infrastructure/repositories/playlist.repository";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const playlistServicesProviders: Provider[] = [
    {
        provide: 'GetPlaylistByIdService',
        useFactory: (playlistRepository: IPlaylistRepository, artistRepository: IArtistRepository, songRepository: ISongRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetPlaylistByIdService(
                playlistRepository,
                songRepository,
                artistRepository,
              ),
              auditingRepository,
              'GetPlaylistByIdService',
              logger,
            ),
            logger,
            'GetPlaylistByIdService',
          );
        },
        inject: ['PlaylistRepository', 'ArtistRepository', 'SongRepository', 'AuditingRepository', 'ILogger'],
      },
      {
        provide: 'GetTopPlaylistService',
        useFactory: (playlistRepository: IPlaylistRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetTopPlaylistService(playlistRepository),
              auditingRepository,
              'GetTopPlaylistService',
              logger,
            ),
            logger,
            'GetTopPlaylistService',
          );
        },
        inject: ['PlaylistRepository', 'AuditingRepository', 'ILogger'],
      },
]