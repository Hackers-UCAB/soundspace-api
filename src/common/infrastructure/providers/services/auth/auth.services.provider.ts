import { Provider } from '@nestjs/common';
import { IJwtGenerator } from 'src/auth/application/interface/jwt-generator.interface';
import { LoginGuestApplicationService } from 'src/auth/application/services/log-in-guest-service.application.service';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { SignUpDigitelApplicationService } from 'src/auth/application/services/sign-up-digitel-service.application.service';
import { SignUpMovistarApplicationService } from 'src/auth/application/services/sign-up-movistar-service.application.service';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { EventBus } from 'src/common/infrastructure/events/event-bus';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { SubscriptionRepository } from 'src/subscription/infrastructure/repositories/subscription.repository';
import { DigitelSubscriptionValidation } from 'src/subscription/infrastructure/validation/digitel-subscription-validation';
import { MovistarSubscriptionValidation } from 'src/subscription/infrastructure/validation/movistar-subscription-validation';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { OrmUserMapper } from 'src/user/infrastructure/mapper/orm-user.mapper';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { DataSource } from 'typeorm';

export const authServicesProviders: Provider[] = [
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      subscriptionRepository: ISubscriptionRepository,
      eventBus: EventBus,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpMovistarApplicationService(
            userRepository,
            subscriptionRepository,
            uuidGenerator,
            new MovistarSubscriptionValidation(),
            jwtGenerator,
            eventBus,
          ),
          auditingRepository,
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
      'SubscriptionRepository',
      'EventBus',
      'AuditingRepository',
      'ILogger',
      'IUuidGenerator',
    ],
  },
  {
    provide: 'DigitelSignUpApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      subscriptionRepository: ISubscriptionRepository,
      eventBus: EventBus,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
      uuidGenerator: IIdGenerator<string>,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpDigitelApplicationService(
            userRepository,
            subscriptionRepository,
            uuidGenerator,
            new DigitelSubscriptionValidation(),
            jwtGenerator,
            eventBus,
          ),
          auditingRepository,
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
      'SubscriptionRepository',
      'EventBus',
      'AuditingRepository',
      'ILogger',
      'IUuidGenerator',
    ],
  },
  {
    provide: 'LogInApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      subscriptionRepository: ISubscriptionRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginApplicationService(
            subscriptionRepository,
            userRepository,
            jwtGenerator,
          ),
          auditingRepository,
          'Log-In',
          logger,
        ),
        logger,
        'Log-In',
      );
    },
    inject: ['IJwtGenerator','UserRepository', 'SubscriptionRepository', 'AuditingRepository','ILogger'],
  },
  {
    provide: 'LogInGuestApplicationService',
    useFactory: (
      jwtGenerator: IJwtGenerator,
      userRepository: IUserRepository,
      auditingRepository: IAuditingRepository,
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
          auditingRepository,
          'Log-In Guest',
          logger,
        ),
        logger,
        'Log-In Guest',
      );
    },
    inject: ['IJwtGenerator', 'UserRepository', 'AuditingRepository', 'ILogger', 'IUuidGenerator'],
  },
];
