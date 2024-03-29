import { Provider } from '@nestjs/common';
import { GetAlbumByIdService } from 'src/album/application/services/get-album-by-id.application.service';
import { GetTopAlbumService } from 'src/album/application/services/get-top-album.application.service';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IAuditingRepository } from 'src/common/application/auditing/repositories/auditing.repository.interface';
import { AuditingServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { SecurityApplicationServiceDecorator } from 'src/common/application/services/decorators/security-decorator/security-application-service.service.decorator';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';

export const albumServicesProviders: Provider[] = [
  {
    provide: 'GetAlbumByIdService',
    useFactory: (
      userRepository: IUserRepository,
      albumRepository: IAlbumRepository,
      artistRepository: IArtistRepository,
      songRepository: ISongRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new SecurityApplicationServiceDecorator(
            new GetAlbumByIdService(
              albumRepository,
              artistRepository,
              songRepository,
            ),
            userRepository,
            [UserRoleEnum.USER],
          ),
          auditingRepository,
          'GetAlbumByIdService',
          logger,
        ),
        logger,
        'GetAlbumByIdService',
      );
    },
    inject: ['UserRepository','AlbumRepository', 'ArtistRepository', 'SongRepository', 'AuditingRepository', 'ILogger'],
  },
  {
    provide: 'GetTopAlbumService',
    useFactory: (
      albumRepository: IAlbumRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new GetTopAlbumService(albumRepository),
          auditingRepository,
          'GetTopAlbumService',
          logger,
        ),
        logger,
        'GetTopAlbumService',
      );
    },
    inject: ['AlbumRepository', 'AuditingRepository', 'ILogger'],
  },
];
