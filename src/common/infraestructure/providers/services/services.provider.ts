import { Provider } from '@nestjs/common';

import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';
import { UuidGenerator } from '../../uuid-generator';
import { EventBus } from '../../events/event-bus';
import { SignUpMovistarApplicationService } from 'src/auth/application/services/sign-up-movistar-service.application.service';
import { MovistarSubscriptionValidation } from 'src/subscription/infraestructure/validation/movistar-subscription-validation';
import { SignUpDigitelApplicationService } from 'src/auth/application/services/sign-up-digitel-service.application.service';
import { DigitelSubscriptionValidation } from 'src/subscription/infraestructure/validation/digitel-subscription-validation';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { AuditingRepository } from '../../repositories/auditing.repository';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IJwtGenerator } from 'src/auth/application/interface/jwt-generator.interface';
import { LoginGuestApplicationService } from 'src/auth/application/services/log-in-guest-service.application.service';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { PlaySongService } from 'src/song/application/services/play-song.application.service';
import { SongRepository } from 'src/song/infraestructure/repositories/song.repository';
import { AzureBlobHelper } from 'src/song/infraestructure/helpers/get-blob-file.helper';
import { SendSongHelper } from 'src/song/infraestructure/helpers/send-song-helper';
import { CheckCloseToExpireSubscriptionsApplicationService } from 'src/subscription/application/services/check-close-to-expire-subscriptions.application.service';
import { CheckExpiredSubscriptionsApplicationService } from 'src/subscription/application/services/check-expired-subscriptions.application.service';
import { GetUserInfoApplicationService } from 'src/user/application/services/get-user-info.application.service';
import { UpdateUserInfoApplicationService } from 'src/user/application/services/update-user-info.application.service';
import { GetPlaylistByIdService } from '../../../../playlist/application/services/get-playlist-by-id.application.service';
import { PlaylistRepository } from '../../../../playlist/infrastructure/repositories/playlist.repository';
import { SecurityApplicationServiceDecorator } from 'src/common/application/services/decorators/security-decorator/security-application-service.service.decorator';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { PromotionRepository } from 'src/promotions/infraestructure/repositories/promotion.repository';
import { GetRandomPromotionApplicationService } from 'src/promotions/application/services/get-random-promotion.application.service';
import { AzureBufferImageHelper } from '../../azure/helpers/get-blob-image.helper';
import { GetTopPlaylistService } from '../../../../playlist/application/services/get-top-playlist.application.service';
import { OrmSongMapper } from '../../../../song/infraestructure/mapper/orm-song.mapper';
import { GetAlbumByIdService } from 'src/album/application/services/get-album-by-id.application.service';
import { AlbumRepository } from 'src/album/infraestructure/repositories/album.repository';
import { GetTopAlbumService } from 'src/album/application/services/get-top-album.application.service';
import { GetArtistByIdService } from '../../../../artist/application/services/get-artist-by-id.application.service';
import { ArtistRepository } from '../../../../artist/infraestructure/repositories/artist.repository';
import { GetTopSongsService } from '../../../../song/application/services/get-top-songs.application.service';
import { SearchApplicationService } from 'src/search/application/services/search.application.service';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchAlbumsApplicationService } from 'src/album/application/services/search-albums.application.service';
import { SearchArtistsApplicationService } from 'src/artist/application/services/search-artists.application.service';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { SearchPlaylistsApplicationService } from 'src/playlist/application/services/search-playlists.application.service';
import { SearchSongsApplicationService } from 'src/song/application/services/search-songs.application.service';
import { CancelSubscriptionApplicationService } from 'src/subscription/application/services/cancel-subscription.application.service';
import { OrmArtistMapper } from '../../../../artist/infraestructure/mapper/orm-artist.mapper';

export const servicesProvidersManager: Provider[] = [
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      dataSource: DataSource,
      eventBus: EventBus,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpMovistarApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            uuidGenerator,
            new MovistarSubscriptionValidation(),
            jwtGenerator,
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Movistar Sign-Up',
          logger,
        ),
        logger,
        'Movistar Sign-Up',
      );
    },
    inject: [
      'IJwtGenerator',
      'DataSource',
      'EventBus',
      'ILogger',
      'IUuidGenerator',
    ],
  },
  {
    provide: 'DigitelSignUpApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      dataSource: DataSource,
      eventBus: EventBus,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpDigitelApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            uuidGenerator,
            new DigitelSubscriptionValidation(),
            jwtGenerator,
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Digitel Sign-Up',
          logger,
        ),
        logger,
        'Digitel Sign-Up',
      );
    },
    inject: [
      'IJwtGenerator',
      'DataSource',
      'EventBus',
      'ILogger',
      'IUuidGenerator',
    ],
  },
  {
    provide: 'LogInApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      dataSource: DataSource,
      logger: ILogger,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginApplicationService(
            new SubscriptionRepository(dataSource),
            new UserRepository(dataSource),
            jwtGenerator,
          ),
          new AuditingRepository(dataSource),
          'Log-In',
          logger,
        ),
        logger,
        'Log-In',
      );
    },
    inject: ['IJwtGenerator', 'DataSource', 'ILogger'],
  },
  {
    provide: 'LogInGuestApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      dataSource: DataSource,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginGuestApplicationService(
            new UserRepository(dataSource),
            jwtGenerator,
            uuidGenerator,
          ),
          new AuditingRepository(dataSource),
          'Log-In Guest',
          logger,
        ),
        logger,
        'Log-In Guest',
      );
    },
    inject: ['IJwtGenerator', 'DataSource', 'ILogger', 'IUuidGenerator'],
  },
  // {
  //   provide: 'PlaySongApplicationService',
  //   useFactory: (dataSource: DataSource, client: any, logger: ILogger) => {
  //     return new LoggerApplicationServiceDecorator(
  //       new AuditingCommandServiceDecorator(
  //           new PlaySongService(
  //           new SongRepository(dataSource),
  //           new UuidGenerator(),
  //           new AzureBlobHelper(),
  //           new SendSongHelper(),
  //           client),
  //         new AuditingRepository(dataSource),
  //         'PlaySongService',
  //         logger
  //       ),
  //       logger,
  //       'PlaySongService',
  //     );
  //   },
  //   inject: ['DataSource', 'ILogger'],
  // }
  {
    provide: 'CheckExpiredSubscriptionsApplicationService',
    useFactory: (
      dataSource: DataSource,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CheckExpiredSubscriptionsApplicationService(
            new SubscriptionRepository(dataSource),
            new UserRepository(dataSource),
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Check Expired Subscriptions',
          logger,
        ),
        logger,
        'Check Expired Subscriptions',
      );
    },
    inject: ['DataSource', 'ILogger', 'EventBus'],
  },
  {
    provide: 'CheckCloseToExpireSubscriptionsApplicationService',
    useFactory: (
      dataSource: DataSource,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CheckCloseToExpireSubscriptionsApplicationService(
            new SubscriptionRepository(dataSource),
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Check Close To Expire Subscriptions',
          logger,
        ),
        logger,
        'Check Close To Expire Subscriptions',
      );
    },
    inject: ['DataSource', 'ILogger', 'EventBus'],
  },
  {
    provide: 'GetUserInfoApplicationService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SecurityApplicationServiceDecorator(
            new GetUserInfoApplicationService(new UserRepository(dataSource)),
            new UserRepository(dataSource),
            [UserRoleEnum.USER],
          ),
          new AuditingRepository(dataSource),
          'Get User Info',
          logger,
        ),
        logger,
        'Get User Info',
      );
    },
    inject: ['DataSource', 'ILogger'],
  },
  {
    provide: 'UpdateUserInfoApplicationService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SecurityApplicationServiceDecorator(
            new UpdateUserInfoApplicationService(
              new UserRepository(dataSource),
            ),
            new UserRepository(dataSource),
            [UserRoleEnum.USER],
          ),
          new AuditingRepository(dataSource),
          'Update User Info',
          logger,
        ),
        logger,
        'Update User Info',
      );
    },
    inject: ['DataSource', 'ILogger'],
  },
  {
    provide: 'GetRandomPromotionApplicationService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new GetRandomPromotionApplicationService(
            new PromotionRepository(dataSource),
            new AzureBufferImageHelper(),
          ),
          new AuditingRepository(dataSource),
          'Get Random Promotion',
          logger,
        ),
        logger,
        'Get Random Promotion',
      );
    },
    inject: ['DataSource', 'ILogger'],
  },
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
          new GetTopPlaylistService(
            new PlaylistRepository(dataSource),
            new AzureBufferImageHelper(),
          ),
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
  {
    provide: 'GetAlbumByIdService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new GetAlbumByIdService(
            new AlbumRepository(dataSource),
            new ArtistRepository(dataSource),
            new SongRepository(dataSource, new OrmSongMapper()),
            new AzureBufferImageHelper(),
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
          new GetTopAlbumService(
            new AlbumRepository(dataSource),
            new AzureBufferImageHelper(),
          ),
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
  {
    provide: 'GetArtistByIdService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new GetArtistByIdService(
            new ArtistRepository(dataSource),
            new AzureBufferImageHelper(),
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
    provide: 'SearchApplicationService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      let strategies: Record<
        string,
        IApplicationService<
          SearchItemsEntryApplicationDto,
          SearchItemsResponseApplicationDto
        >
      >;

      strategies = {
        song: new SearchSongsApplicationService(
          new SongRepository(dataSource, new OrmSongMapper()),
        ),
        album: new SearchAlbumsApplicationService(
          new AlbumRepository(dataSource),
        ),
        playlist: new SearchPlaylistsApplicationService(
          new PlaylistRepository(dataSource),
        ),
        artist: new SearchArtistsApplicationService(
          new ArtistRepository(dataSource),
        ),
      };
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SearchApplicationService(strategies),
          new AuditingRepository(dataSource),
          'Search Service',
          logger,
        ),
        logger,
        'Search Service',
      );
    },
    inject: ['DataSource', 'ILogger'],
  },
  {
    provide: 'CancelSubscriptionService',
    useFactory: (dataSource: DataSource, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CancelSubscriptionApplicationService(new SubscriptionRepository(dataSource), new UserRepository(dataSource)),
          new AuditingRepository(dataSource),
          'CancelSubscriptionService',
          logger,
        ),
        logger,
        'CancelSubscriptionService',
      );
    },
    inject: ['DataSource', 'ILogger'],
  },
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
];
