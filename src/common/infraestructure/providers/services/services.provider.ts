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

export const servicesProvidersManager: Provider[] = [
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, eventBus: EventBus, logger: ILogger, uuidGenerator: IIdGenerator<string> ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpMovistarApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            uuidGenerator,
            new MovistarSubscriptionValidation(),
            jwtGenerator,
            eventBus
          ),
          new AuditingRepository(dataSource),
          'Movistar Sign-Up',
          logger,
        ),
        logger,
        'Movistar Sign-Up',
      );
    },
    inject: [ 'IJwtGenerator', 'DataSource', 'EventBus', 'ILogger', 'IUuidGenerator'],
  },
  {
    provide: 'DigitelSignUpApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, eventBus: EventBus, logger: ILogger, uuidGenerator: IIdGenerator<string> ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpDigitelApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            uuidGenerator,
            new DigitelSubscriptionValidation(),
            jwtGenerator,
            eventBus
          ),
          new AuditingRepository(dataSource),
          'Digitel Sign-Up',
          logger
        ),
        logger,
        'Digitel Sign-Up',
      );
    },
    inject: ['IJwtGenerator','DataSource', 'EventBus', 'ILogger', 'IUuidGenerator'],
  },
  {
    provide: 'LogInApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, logger: ILogger ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginApplicationService(
            new SubscriptionRepository(dataSource),
            new UserRepository(dataSource),
            jwtGenerator
          ),
          new AuditingRepository(dataSource),
          'Log-In',
          logger,
        ),
        logger,
        'Log-In',
      )
    },
    inject: ['IJwtGenerator', 'DataSource', 'ILogger'],
  },
  {
    provide: 'LogInGuestApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, logger: ILogger, uuidGenerator: IIdGenerator<string> ) => {
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
      )
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
];