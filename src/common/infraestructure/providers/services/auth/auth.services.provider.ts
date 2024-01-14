import { Provider } from '@nestjs/common';
import { IJwtGenerator } from 'src/auth/application/interface/jwt-generator.interface';
import { LoginGuestApplicationService } from 'src/auth/application/services/log-in-guest-service.application.service';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { SignUpDigitelApplicationService } from 'src/auth/application/services/sign-up-digitel-service.application.service';
import { SignUpMovistarApplicationService } from 'src/auth/application/services/sign-up-movistar-service.application.service';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { EventBus } from 'src/common/infraestructure/events/event-bus';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { DigitelSubscriptionValidation } from 'src/subscription/infraestructure/validation/digitel-subscription-validation';
import { MovistarSubscriptionValidation } from 'src/subscription/infraestructure/validation/movistar-subscription-validation';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { OrmUserMapper } from 'src/user/infraestructure/mapper/orm-user.mapper';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';

export const authServicesProviders: Provider[] = [
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      dataSource: DataSource,
      eventBus: EventBus,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpMovistarApplicationService(
            userRepository,
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
      'UserRepository',
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
      userRepository: IUserRepository,
      dataSource: DataSource,
      eventBus: EventBus,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpDigitelApplicationService(
            userRepository,
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
      'UserRepository',
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
      userRepository: IUserRepository,
      logger: ILogger,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginApplicationService(
            new SubscriptionRepository(dataSource),
            userRepository,
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
    inject: ['IJwtGenerator','DataSource','UserRepository', 'ILogger'],
  },
  {
    provide: 'LogInGuestApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      dataSource: DataSource,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginGuestApplicationService(
            userRepository,
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
    inject: ['IJwtGenerator', 'UserRepository', 'DataSource', 'ILogger', 'IUuidGenerator'],
  },
];
