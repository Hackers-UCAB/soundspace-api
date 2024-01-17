import { Provider } from "@nestjs/common";
import { IArtistRepository } from "src/artist/domain/repositories/artist.repository.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { SecurityApplicationServiceDecorator } from "src/common/application/services/decorators/security-decorator/security-application-service.service.decorator";
import { GetPlaylistByIdService } from "src/playlist/application/services/get-playlist-by-id.application.service";
import { GetTopPlaylistService } from "src/playlist/application/services/get-top-playlist.application.service";
import { IPlaylistRepository } from "src/playlist/domain/repositories/playlist.repository.interface";
import { ISongRepository } from "src/song/domain/repositories/song.repository.interface";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";



export const playlistServicesProviders: Provider[] = [
    {
        provide: 'GetPlaylistByIdService',
        useFactory: (userRepository: IUserRepository,playlistRepository: IPlaylistRepository, artistRepository: IArtistRepository, songRepository: ISongRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingServiceDecorator(
              new SecurityApplicationServiceDecorator(
                new GetPlaylistByIdService(
                  playlistRepository,
                  songRepository,
                  artistRepository,
                ),
                userRepository,
                [UserRoleEnum.USER],
              ),
              auditingRepository,
              'GetPlaylistByIdService',
              logger,
            ),
            logger,
            'GetPlaylistByIdService',
          );
        },
        inject: ['UserRepository','PlaylistRepository', 'ArtistRepository', 'SongRepository', 'AuditingRepository', 'ILogger'],
      },
      {
        provide: 'GetTopPlaylistService',
        useFactory: (playlistRepository: IPlaylistRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingServiceDecorator(
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